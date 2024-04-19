import { DJGet, Document, InfoResponse } from "../../types";
import { deleteDocRest } from "../deleteDoc";
import { queryDocsRest } from "../queryDocs";
import { setDocRest } from "../setDoc";

function splitStringIntoChunks(str: string, chunkSize = 950_000) {
    const chunks = [];
    for (let i = 0; i < str.length; i += chunkSize) {
        chunks.push(str.slice(i, i + chunkSize));
    }
    return chunks;
}

export async function DocsToJSONRest<T extends object>(collectionPath: string, options?: {
    db: string,
}): Promise<DJGet> {
    try {
        const docsRes = await queryDocsRest<{ JSON_STRING: string }>(collectionPath, {
            orderBy: {
                field: 'index',
                direction: 'ASCENDING'
            },
            db: options?.db
        }).then((docsRes) => {
            // force the order of the documents
            const orderedDocs = docsRes.docs.sort((a, b) => {
                const aIndex = Number(a.id.split('_').pop());
                const bIndex = Number(b.id.split('_').pop());
                return aIndex - bIndex;
            })
            return {
                ...docsRes,
                docs: orderedDocs
            }
        });

        const concattedJSONString = docsRes.docs.map((doc) => doc?.data()?.JSON_STRING || '').join('');
        const finalJsonArr = JSON.parse(concattedJSONString || "[]");
        if (!Array.isArray(finalJsonArr)) {
            throw new Error(`JSON payload in collection ${collectionPath} is corrupt, a collection using the DJ engine can't be used to store anything else but its own document data.`);
        }
        const finalJson: Document[] = JSON.parse(concattedJSONString || "[]").map((doc: any, index: number) => {
            return {
                id: `JSON_STRING_${index}`,
                data: () => doc,
                exists: true
            }
        });
        // console.log(finalJson.length)
        return {
            size: finalJson?.length || 0,
            empty: finalJson?.length ? false : true,
            docReads: docsRes?.size || 0,
            docs: finalJson,
            jsonResponse: docsRes.jsonResponse,
        }
    } catch (error) {
        console.error(`!! error in docs to json`, error);
        return {
            size: 0,
            empty: true,
            docs: [],
            error: error,
            docReads: 0
        }
    }
}

export async function JSONtoDocsRest<T extends object>(
    collectionPath: string,
    data: T[],
    options?: {
        db?: string,
    }): Promise<{
        success: boolean,
        message?: string,
        error?: any
    }> {
    try {
        const chunkSize = 950_000; // max characteers in each doc
        // const dbToUse = bucket === 'voiceglow-eu' ? eu_db : na_db;
        const finalJsonString = JSON.stringify(data);
        const jsonArr = splitStringIntoChunks(finalJsonString, chunkSize);

        const writePromises = jsonArr.map((jsonPart, index) => {
            return setDocRest(`${collectionPath}/JSON_STRING_${index}`, {
                JSON_STRING: jsonPart,
                lastDoc: jsonArr?.length || 0, // depracated..
                index: index
            }, {
                db: options?.db,
                merge: true
            });
        });
        await Promise.allSettled(writePromises);
        return {
            success: true,
            message: `Successfully written ${data.length} docs in ${collectionPath}`
        };
    } catch (error) {
        console.error(`error in json to docs`, error)
        return {
            success: false,
            error
        }
    }
}

export async function DJDeleteREST(collectionPath: string, options: {
    db?: string
}): Promise<InfoResponse> {
    try {

        const docsRes = await queryDocsRest<{ JSON_STRING: string }>(collectionPath, {
            db: options?.db,
            limit: 100
        });

        if (docsRes.empty) {
            return {
                success: false,
                message: `No docs to delete in ${collectionPath}`,
                jsonResponse: docsRes.jsonResponse
            }
        }
        // console.log(`docs res: `, docsRes.docs.length);
        const delPromises = []
        for (let i = 0; i < docsRes.docs?.length; i++) {
            const docId = docsRes.docs[i].id;
            delPromises.push(
                deleteDocRest(`${collectionPath}/${docId}`, {
                    db: options?.db
                })
            );
        }
        await Promise.allSettled(delPromises);
        return {
            success: true,
            message: `Successfully deleted ${docsRes.docs?.length} docs in ${collectionPath}`,
            jsonResponse: docsRes.jsonResponse
        };
    } catch (error) {
        console.error(`error in collection delete`, error);
        throw new Error(`Error deleting docs in ${collectionPath}`);
    }
}


