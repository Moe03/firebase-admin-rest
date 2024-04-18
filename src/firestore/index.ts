import { initFirebaseRest } from "../firebase-auth-utils/initFirebase"
import { addDocRest } from "./addDocRest"
import { deleteDocRest } from "./deleteDoc"
import { getDocRest } from "./getDoc"
import { queryDocsRest } from "./queryDocs"
import { setDocRest } from "./setDoc"
import { updateDocRest } from "./updateDoc"

export {
    initFirebaseRest,
    getDocRest,
    queryDocsRest,
    deleteDocRest,
    updateDocRest,
    setDocRest,
    addDocRest,
}