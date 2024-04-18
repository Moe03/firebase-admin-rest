
import { RestFirestoreInstance } from "../firestore/RestFirestoreInstance";
import { InitFirebaseAdminInput } from "../types";

export async function initFirebaseAdmin(options?: InitFirebaseAdminInput){
    const db = await new RestFirestoreInstance(options).initApp();
    return db;
}