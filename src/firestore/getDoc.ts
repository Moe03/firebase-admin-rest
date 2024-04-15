import { typedEnv } from "..";
import { CompatibleDocument } from "../types";
import { formatValuesWithType, generateFirebaseReqHeaders } from "./utils";

/**
 * Fetches documents from Firestore.
 * @param {string} docPath - The path to the Firestore document.
 * @param {Object | undefined} options - Additional options for fetching documents.
 * @param {number | undefined} options.db - Optional. database-id instead of the default one.
 * @template T - The type of the document being fetched. Defaults to 'any'.
* @returns {Promise<CompatibleDocument<T>>} A Promise that resolves to a response object containing fetched Firestore document.
 */
export async function getDocEdge(
    docPath: string,
    options?: {
        db?: string
    }): Promise<CompatibleDocument> {
    try {
        const response: any = await fetch(`https://firestore.googleapis.com/v1beta1/projects/speakwiz-app/databases/${typedEnv.FIREBASE_REST_PROJECT_ID}/documents/${docPath}`, {
            method: 'GET',
            headers: generateFirebaseReqHeaders(options?.db || typedEnv.FIREBASE_REST_DATABASE_ID)
        }
        ).then((res) => res.json());
        // console.log(response)

        if (response?.fields) {
            return {
                id: docPath.includes(`/`) ? (docPath.split('/').pop() || docPath) : docPath,
                exists: () => true,
                data: () => formatValuesWithType(response)
            }
        } else {
            return {
                id: docPath.includes(`/`) ? (docPath.split('/').pop() || docPath) : docPath,
                exists: () => false,
                data: () => undefined,
            }
        }
    } catch (error) {
        console.error(error)
        return {
            id: docPath.includes(`/`) ? (docPath.split('/').pop() || docPath) : docPath,
            exists: () => false,
            data: () => undefined,
            error: error,
        }
    }
}
