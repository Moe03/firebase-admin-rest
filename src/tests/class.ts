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
    const doc = await db.collection<User>(`users`).where(`email`, `==`, `test@gmail.com`).limit(10).page(1).get();
    console.log(doc.docs.map(doc => doc.data()));
}
test()