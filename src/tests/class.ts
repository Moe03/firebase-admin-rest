// import { initFirebaseRest } from "../firestore";
import moment from "moment";
import { initFirebaseAdmin } from "../admin";
import { generateRandomId } from "../firestore/utils";

export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
}

async function testGetDocs() {
    // await initFirebaseRest();
    const db = await initFirebaseAdmin();
    const docs = await db.collection<User>(`test_3/test_1/test_1`).get();
    console.log(docs.docs.length);
}

async function testJSSet() {
    const db = await initFirebaseAdmin();

    // storing about 25 mbs of data >>
    const res = await db.collection(`test_3/test_1/test_1`).todocs(
        new Array(25_000).fill({
            name: generateRandomId(10),
            ts: moment().unix()
        })
    );
    console.log(res);
}

async function testGetDB(){
    const db = await initFirebaseAdmin();
    const docs = await db.collection(`test_3/test_1/test_1`).tojson();
    console.log({...docs, docs: []});
}

async function deleteDJCollection(){
    const db = await initFirebaseAdmin();
    const res = await db.collection(`test_3/test_1/test_1`).delete();
    console.log(res);
}

deleteDJCollection();