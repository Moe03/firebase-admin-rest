import { GetDocumentResponse } from "../types";
import { setDocRest } from "./setDoc";
import { generateRandomId, removeFirstAndLastSlash } from "./utils"

/**
 * Adds a new document to a Firestore collection using REST API.
 * 
 * @param collectionPath - The path of the collection where the document will be added.
 * @param docData - The data of the document to be added.
 * @param options - Additional options for the operation.
 * @param options.db - The name of the Firestore database to use. (optional)
 * @returns A Promise that resolves to the result of the add operation.
 */
export async function addDocRest<T extends object>(
    collectionPath: string,
    docData: T,
    options?: {
        db?: string
    }
): Promise<GetDocumentResponse<T>> {
    const newDocId = generateRandomId(20);
    collectionPath = removeFirstAndLastSlash(collectionPath);
    const addDocRes = await setDocRest<T>(
        `${collectionPath}/${newDocId}`,
        docData,
        {
            merge: false,
            db: options?.db
        }
    )
    return addDocRes
}