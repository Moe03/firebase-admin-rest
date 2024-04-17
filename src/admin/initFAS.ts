import { FirebaseAdminRest } from "../firestore/FARClass";
import { InitFirebaseAdminInput } from "../types";

export async function initFirebaseAdmin(options?: InitFirebaseAdminInput){
    const db = await new FirebaseAdminRest(options).initApp();
    return db;
}