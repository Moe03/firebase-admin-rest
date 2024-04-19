import { initFirebaseRest } from "src/admin";

// get a document
async function getDoc() {
    const db = await initFirebaseRest({
        serviceAccount: ,
        databaseId: '(default)', // change it to a custom db
    }).firestore();
    const docRef = await db.doc(`users/test_1`).get();

    console.log(docRef.data())
}

// getDocs example
async function getDocs() {
    const db = await initFirebaseRest().firestore();
    const docsRef = await db.collection('users').get();

    docsRef.docs.forEach(element => {
        console.log(element.data())
    });
}

// query documents with typesafety
type User = {
    id: string,
    name: string,
    age: number,
    email: string
}

async function queryDocs1() {
    const db = await initFirebaseRest().firestore();
    const docsRef = await db.collection<User>('users').where('age', '>', 25).get();

    docsRef.docs.forEach(element => {
        const user = element.data();
        console.log(user?.name)
    });
}


// query with where and orderBy
// also handles automatically outputting the composite index link to create it if needed!
async function queryDocs2() {
    const db = await initFirebaseRest().firestore();
    const docsRef = await db.collection<User>('users').where('name', '==', 'John Doe').orderBy('age', 'desc').get();

    docsRef.docs.forEach(element => {
        const user = element.data();
        console.log(user?.name)
    });
}

// query with limit and pagination using our helper functions
async function queryDocs3() {
    const db = await initFirebaseRest().firestore();
    const docsRef = await db.collection<User>('users').where('age', '>', 25).orderBy('age', 'desc').limit(5).page(3).get(); // 5 items per page if you set limit

    docsRef.docs.forEach(element => {
        const user = element.data();
        console.log(user?.name)
    });
}

// in addition to having the same structure, functionality and typesafety as the official firestore sdk, we also have some additional features like:
// opinionated helper engine for storing large data (analytics for example)
// this basically converts a collection and reserves it into a large JSON string filled with documents
async function collectionToDocs() {
    const db = await initFirebaseRest().firestore();
    const docsRef = await db.collection<User>('big_data').todocs(
        Array(100_000).fill(null).map((item, index) => {
            return {
                id: `${Math.random().toString(36).substring(7)}`,
                name: `John Doe ${index}`,
                age: 30,
                email: `atoot@gmail.com`,
            }
        })
    );
    
    console.log(docsRef)
} 

async function collectionToJson(){
    const db = await initFirebaseRest().firestore();
    const docsRef = await db.collection(`big_data`).tojson();

    // this will return a JSON object with the same structure as the collection
    // each document read has 1MB of data, so this is a good way to store large data without querying hundreds or thousands of documents
    // storing on a bucket is also an option, but the bandwidth is expensive and will add up
    console.log(docsRef.docReads)
}

collectionToJson()