import { GetDocumentResponse, TypedEnv } from "../types";
import { formatValuesWithType, generateFirebaseReqHeaders } from "./utils";

/**
 * Fetches documents from Firestore.
 * @param {string} docPath - The path to the Firestore document.
 * @param {Object | undefined} options - Additional options for fetching documents.
 * @param {number | undefined} options.db - Optional. database-id instead of the default one.
 * @template T - The type of the document being fetched. Defaults to 'any'.
* @returns {Promise<CompatibleDocument<T>>} A Promise that resolves to a response object containing fetched Firestore document.
 */
export async function getDocRest(
    docPath: string,
    options?: {
        db?: string,
        debug?: boolean
    }): Promise<GetDocumentResponse> {
    const typedEnv = process.env as TypedEnv;
    if (options?.debug) {
        console.log(generateFirebaseReqHeaders(options?.db || typedEnv.FIREBASE_REST_DATABASE_ID))
    }
    try {
        const response: any = await fetch(`https://firestore.googleapis.com/v1beta1/projects/${typedEnv.FIREBASE_REST_PROJECT_ID}/databases/${typedEnv.FIREBASE_REST_DATABASE_ID}/documents/${docPath}`, {
            method: 'GET',
            headers: generateFirebaseReqHeaders(options?.db || typedEnv.FIREBASE_REST_DATABASE_ID)
        }
        ).then((res) => res.json());

        if (response.error) {
            throw new Error(response.error.message)
        }

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
        throw new Error(`Error fetching document from Firestore: `);
        return {
            id: docPath.includes(`/`) ? (docPath.split('/').pop() || docPath) : docPath,
            exists: () => false,
            data: () => undefined,
            error: error,
        }
    }
}
