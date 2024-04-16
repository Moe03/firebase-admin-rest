import { FirebaseAdminRest } from "../firestore/Class";

async function test() {
    const db = new FirebaseAdminRest();
    const res = await db.collection(`user`).where('name', `EQUAL`, 5).limit(5).get();
    console.log(res);
}
test()