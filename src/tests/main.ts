import { initFirebaseRest } from "../firebase-auth-utils/initFirebase";
import { addDocRest } from "../firestore/addDocRest";
import { getDocRest } from "../firestore/getDoc";
import { queryDocsRest } from "../firestore/queryDocs";
import { setDocRest } from "../firestore/setDoc";
import { generateRandomId } from "../firestore/utils";
const dotenv = require('dotenv');
dotenv.config();
dotenv.config({ path: `.env.local`, override: true });

// THIS IS A FREE FIREBASE PROJECT FOR TESTING PURPOSES
// Please do not abuse :)
// export const freeFirebaseProject = 
// console.log(process.env.FIREBASE_REST_SERVICE_ACCOUNT)

async function testGet() {
    await initFirebaseRest();
    // const res = await getDocRest('users/test_1', {
    //     debug: true
    // });
    // console.log(res.data());
}

async function testSet() {
    await initFirebaseRest();
    const res = await setDocRest('users/test_3', {
        nested: {
            test: 'test',
            test2: 52,
            array: ['test', 'test2', 'test3', 'test4']
        }
    }, {
        merge: false
    });
    console.log(res.data());
}


async function testAdd() {
    await initFirebaseRest();
    await addDocRest('users', {
        name: 'John Doe',
        age: 30,
        email: 'johnjor@gmail.com'
    })
}

async function testQuery() {
    await initFirebaseRest();
    const res = await queryDocsRest('users', {
        where: {
            field: 'email',
            op: "EQUAL",
            value: "johnjor@gmail.com"
        }
    });
    console.log(res.docs.map((doc) => doc.data()));
}

async function testUpdate(){
    await initFirebaseRest();
    const res = await setDocRest('users/test_3', {
        name: generateRandomId(),
        nested: {
            test: 'test',
            test2: 52,
            array: ['test', 'test2', 'test3', 'test4']
        }
    }, {
        merge: true
    });
    console.log(res.data());
}
testGet();
// testGet()
// testSet()
// testAdd()

