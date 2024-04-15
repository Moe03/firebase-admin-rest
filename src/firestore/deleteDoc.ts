import { typedEnv } from "..";
import { generateFirebaseReqHeaders } from "./utils";

/**
 * Fetches documents from Firestore.
 * @param {string} collectionPath - The path to the Firestore collection.
 * @param {Object} options - Additional options for fetching documents.
 * @param {number | undefined} options.limit - Optional. The maximum number of documents to fetch defaults to 100.
 * @param {string | undefined} options.nextPageToken - The token for fetching the next page of documents.
 * @template T - The type of the documents being fetched. Defaults to 'any'.
* @returns {Promise<RestDocuments<T>>} A Promise that resolves to a response object containing fetched Firestore documents.
 */
export async function deleteDocEdge(
    docPath: string,
    options?: {
        limit?: number,
        nextPageToken?: string
    }): Promise<{
        response?: Response,
        error?: any,
    }> {

    try {
        let qs = new URLSearchParams({
            fields: 'documents(fields,name),nextPageToken',
        });

        if (options?.nextPageToken) {
            qs.append('pageToken', options.nextPageToken);
        }

        const deleteResponse = await fetch(`https://firestore.googleapis.com/v1beta1/projects/speakwiz-app/databases/${typedEnv.FIREBASE_REST_DATABASE_ID}/documents/${docPath}`, {
            method: 'DELETE',
            headers: {
                ...generateFirebaseReqHeaders()
            },
        })
        return {
            response: deleteResponse
        }
    } catch (error) {
        return {
            error: error
        }
    }

}