import { GetDocumentResponse, TypedEnv } from "../types";
import { generateFirebaseReqHeaders, humanObjectToDumbGoogle, removeFirstAndLastSlash } from "./utils";


/**
 * Sets a document in a Firestore collection using REST API, DEFAULT WILL OVERWRITE THE DOCUMENT.
 *
 * @remarks
 * This function allows setting a document in a Firestore collection using the REST API.
 *
 * @param collectionPath - The path to the collection.
 * @param docData - The document to set in the collection.
 * @param options - Additional options for setting the document.
 * @param options.db - Optional. The database-id instead of the default one.
 * @param options.merge - Optional. Whether to merge the document with existing documents default WILL OVERWRITE THE DOCUMENT.
 * @returns A Promise resolving when the document is successfully set.
 *
 * @typeparam T - The type of the document to set, extending an object type.
 *
 * @example
 * // Import the function if not already imported
 * // import { setDocRest } from 'your-module-name';
 * 
 * // Example usage
 * const collectionPath = 'users';
 * const document = {
 *     name: 'John Doe',
 *     age: 30,
 *     email: 'johndoe@example.com'
 * };
 * 
 * try {
 *     const doc = await setDocRest<User>(collectionPath, document);
 *     console.log('Document set successfully.', doc.id);
 * } catch (error) {
 *     console.error('Error setting document:', error);
 * }
 */
export async function setDocRest<T extends object>(
    docPath: string,
    docData: T,
    options?: {
        db?: string,
        merge?: boolean
    }): Promise<GetDocumentResponse<T>> {

    // if(options.merge === undefined){
    //     options.merge = true;
    // }
    const typedEnv = process.env as TypedEnv;
    docPath = removeFirstAndLastSlash(docPath);
    const docId = docPath?.includes(`/`) ? (docPath.split('/').pop() || docPath) : docPath;
    const dumbGoogleObject = humanObjectToDumbGoogle(docData);
 
    const mergeAppend = options?.merge ? `?${Object.keys(docData).map((key, index) => (index !== 0 ? '&' : '') + `updateMask.fieldPaths=${key}`).join('')}` : ''
    const setDocRes: any = await fetch(`https://firestore.googleapis.com/v1beta1/projects/${typedEnv.FIREBASE_REST_PROJECT_ID}/databases/${typedEnv.FIREBASE_REST_DATABASE_ID}/documents/${docPath}${mergeAppend}`, {
        method: 'PATCH',
        headers: generateFirebaseReqHeaders(options?.db || ''),
        body: JSON.stringify({
            fields: dumbGoogleObject
        })
    })
    if (setDocRes.status !== 200) {
        throw new Error(`Non 200 status req, error setting/updating document ${docPath} in Firestore `, setDocRes)
    }
    return {
        id: docId,
        exists: () => true,
        data: () => docData,
        response: setDocRes
    }
}