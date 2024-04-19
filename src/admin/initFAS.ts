
import { InitFirebaseAdminInput } from "src/types";
import RestFirestoreInstance from "../firestore/RestFirestoreInstance";

export function initFirebaseRest(options?: InitFirebaseAdminInput) {
    const db = new RestFirestoreInstance(options)
    return db;
}