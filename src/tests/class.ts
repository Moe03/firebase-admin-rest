// import { initFirebaseRest } from "../firestore";
import { initFirebaseAdmin } from "../admin";

export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
}

async function test() {
    // await initFirebaseRest();
    const db = await initFirebaseAdmin();
    const doc = await db.doc<User>(`users/test_1`).get();
    console.log(doc.data())
}
test()