
import { OrderByDirection, WhereFilterOp } from '@google-cloud/firestore';
import { DirectionOpREST, RestDocuments, TypedEnv, WhereFilterOpREST } from '../types';
import { formatValuesWithType, generateFirebaseReqHeaders, humanObjectToDumbGoogle, humanValueToDumbGoogle } from './utils';

/**
 * Queries documents from a Firestore collection using REST API.
 *
 * @remarks
 * This function allows querying documents from a Firestore collection using the REST API.
 *
 * @param {string} collectionPath - The path to the collection.
 * @param options - Additional options for querying documents.
 * @param options.where - Specifies conditions for filtering documents.
 * @param options.where.field - The field to filter on.
 * @param options.where.op - The comparison operator for the filter (e.g., '>', '==').
 * @param options.where.value - The value to compare against.
 * @param options.orderBy - Specifies the field and direction for ordering the results.
 * @param options.orderBy.field - The field to use for ordering.
 * @param options.orderBy.direction - The direction of ordering ('asc' for ascending, 'desc' for descending).
 * @param options.limit - Limits the number of documents to retrieve.
 * @param options.page - Specifies the page number when paginating results.
 * @returns A Promise resolving to the queried documents.
 *
 * @typeparam T - The type of documents in the collection.
 * @typeparam RestDocuments<T> - The type representing the queried documents.
 *
 * @example
 * // Import the function if not already imported
 * // import { queryDocsRest } from 'your-module-name';
 * 
 * // Example usage
 * const collectionPath = 'users';
 * const options = {
 *     where: {
 *         field: 'age',
 *         op: '>',
 *         value: 25
 *     },
 *     orderBy: {
 *         field: 'name',
 *         direction: 'asc'
 *     },
 *     limit: 10,
 *     page: 1
 * };
 * 
 * try {
 *     const result = await queryDocsRest<User>(collectionPath, options);
 *     console.log('Queried documents:', result);
 * } catch (error) {
 *     console.error('Error querying documents:', error);
 * }
 */
export async function queryDocsRest<T = any>(
    collectionPath: string,
    options?: {
        where: {
            field: string,
            op: WhereFilterOpREST,
            value: any
        },
        orderBy?: {
            field: string,
            direction: DirectionOpREST
        },
        limit?: number,
        page?: number
    }): Promise<RestDocuments<T>> {

    const typedEnv = process.env as TypedEnv;
    const offset = options?.page ? (options.page - 1) * (options.limit || 20) : 0;
    let documentArr = collectionPath.includes(`/`) ? collectionPath.split(`/`) : [];
    let collectionId = documentArr.length ? documentArr.pop() : collectionPath;
    const parentDoc = documentArr?.length ? documentArr.join('/') : '';

    let finalJson: any = {
        "structuredQuery": {
            "from": [{
                "collectionId": collectionId,
            }],
            limit: options?.limit || 100
        },
    }

    if (options?.where?.field && options?.where?.value) {
        finalJson.structuredQuery.where = {
            "fieldFilter": {
                "field": {
                    "fieldPath": options?.where?.field
                },
                "op": options.where.op,
                "value": humanValueToDumbGoogle(options.where.value)
            }
        }
    }

    if (options?.orderBy) {
        finalJson.structuredQuery.orderBy = [
            {
                "field": {
                    "fieldPath": options.orderBy.field
                },
                "direction": options.orderBy.direction
            }
        ]
    }
    if (offset) {
        finalJson.structuredQuery.offset = offset;
    }

    const response: any = await fetch(`https://firestore.googleapis.com/v1beta1/projects/${typedEnv.FIREBASE_REST_PROJECT_ID}/databases/${typedEnv.FIREBASE_REST_DATABASE_ID}/documents${parentDoc ? `/${parentDoc}` : ''}:runQuery`, {
        method: 'POST',
        headers: generateFirebaseReqHeaders(),
        body: JSON.stringify(finalJson)
    }).then((res) => res.json()).catch((err) => {
        throw new Error(`Error fetching in querying documents from Firestore: `, err);
    });

    if (response.error || response[0]?.error) {
        console.error(JSON.stringify(response[0].error))
        throw new Error(`Error in querying documents from Firestore:`);
    }

    if (response.length > 0) {
        const docsArr = response.map((docRef: {
            document: {
                name: string,
                fields: {
                    [key: string]: any
                }
            }
        }) => {
            const res = formatValuesWithType(docRef?.document);
            return res;
        }).filter((doc: any) => doc.id);
        return {
            size: docsArr.length,
            empty: docsArr.length === 0,
            docs: docsArr.map((doc: any) => ({
                id: doc.id,
                exists: () => true,
                data: () => doc
            })),
            jsonResponse: response
        }
    } else {
        return {
            size: 0,
            empty: true,
            docs: [],
            jsonResponse: response
        }; // No document found
    }
}
