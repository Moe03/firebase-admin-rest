import { GetDocumentResponse } from "../types";
import { setDocRest } from "./setDoc";

export async function updateDocRest<T extends object>(
    docPath: string,
    docData: T,
    options?: {
        db?: string
    }): Promise<GetDocumentResponse<T>> {

    const updateDocRes = await setDocRest<T>(docPath, docData, {
        merge: true,
        db: options?.db
    });

    return updateDocRes
}
