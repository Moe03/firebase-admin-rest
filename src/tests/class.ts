import { initFirebaseRest } from "../admin";
// const dotenv = require('dotenv');
// get a document
// var crypto = require('crypto-js');
async function getDoc() {
    const db = await initFirebaseRest({
        serviceAccount: {
            client_email: "firebase-adminsdk-gayzj@best-practices-app.iam.gserviceaccount.com",
            private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDLS9jA40ucUuyj\nYt/aw/SCgK9Sd2p3mJjBeQ7eVQfzVMTZEVGKcICGQTpwn4c1HQkxLn0MQOUftwAx\n/h2N4Lji2Apzf2FbJSjTog+Pizb+jW0dTb4v+1LpgYNYzfHAFYb4MT86m4nmmYmk\n4xYC5rtAr6evxneh2EQxk8FYvcWJcG4Te3om6vCSPac3HhIFKNyS4FtLKc1BrTg/\n6fOMzUN5JhWDxOdtA05TlQhZPii0xUB4jCQ8FjIY9iR3JT0MxC/NVhI/iOaFLTI0\n4Ix2o6YdxF+Q2PO6TSylj8s6VF49ggZQRmrNi2hir7VuFmqGZTOGP1W0tmBOOF9O\n13MRP+S1AgMBAAECggEAA7mBBLRAzj1mIMnqPyuvDv7ASdilZEmMb33dl3F/F118\n8KSZTNng0PBObe/OS+2I+SZqwGEmSF14GruEttBOMt0xkq63MldM8p31WisyEywi\nuqSSIwjpUYq/xOCbWNgC+3aKYHM5W22CIxUWlpRywq2i6Lg+AbmFV3hVHc4bItPj\ntYQ6PMac6MPXp+CZJfH/Covi1WqX7bKRjuSLYGQcOHA0QhX1o0PAsXAcAFJFEaRE\nYeyciXyy5EwPAfsD0NkD97gQ7yZ8zTtNjV2s2qrZk650OlXt/JwfxkZtGiS1FDLZ\nhZx8Vekcl2Qi4/ikMTCZbOhb7LMsoIOLDZbcWaPKQQKBgQDryRyQU2RIyR8ewmyO\n18lxPfmIedca2XzQzUaaGLZU/miD8D54jolEHU0rd3hlVixHzdq6iJKHBARA9jsF\n+MVtwz4H0CklsYKZTnqdZF9nqywLTEGnffTkq1uFQ4OyFn6ne2ukSC2SSK5rVwu2\n098/nVu9UfXAG+XciLC7C2W6xQKBgQDcua2T/qfzyg41jD6HHL4GXoq6if2Vn3x+\npl1MpPZdBEJuNqxKXOqPm6/vjWBYkm0q4btlaoRZVVA2lbaCpLT3jMhA8HTuixfO\nFuZb6pT3dVwxnvzGtuJq+tyoChrxV7sXlUl4rVLTSJpfW3WDlEMOuf/GNmo1HJHF\n768XrSDhMQKBgFwifRfkjjZm6NMzNAppRd0LU5vByI1EWSKaZDFI4M67jwmncjHX\nuMm2DXaju5cVoj34sbTcMy2xIxxjW1MND9DBT1bsP3fsMlVHtmAUXbd7yr0rcihJ\n7s0ALMYZSLfpVFqLvtc2ISCdaBKns/sgNYd9LOEAyt/jxuFzRGQCoyDlAoGBAI0q\n5/weQ9ak5P+Uaa1KUbKLJtj1Rk06iooJ5uQNIVAOWFpa90g8MvyUCyr/1Z3wUIe7\nhXnwbSMhcELo76iQpPkqfi0iXPbv2NLDTKN+3bWCxuspjuucriTTuupyRBcVECCe\nJzZaS/27kpfoS7lSyqyRgyeHR9geJJFeoTJYVQ4RAoGAEJNkjl/HXfEarR/V0495\nZirXcG1QhMgM14VrWm4r1Q8Zh2dLFYXQUlx5FhKh1ltUqjzDFdzBJLDj00sTNh51\nW1UWPMelIt0ai0Es5Q5uKW5boxMmq/BhY9cF5wCh9ogKFQwxegyoVmUzIEh+z2Gb\nnYGkdWbSldRFDbrOcGLKtN0=\n-----END PRIVATE KEY-----\n",
            project_id: "best-practices-app"
        }
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

async function collectionToJson() {
    const db = await initFirebaseRest().firestore();
    const docsRef = await db.collection(`big_data`).tojson();

    // this will return a JSON object with the same structure as the collection
    // each document read has 1MB of data, so this is a good way to store large data without querying hundreds or thousands of documents
    // storing on a bucket is also an option, but the bandwidth is expensive and will add up
    console.log(docsRef.docReads)
}

getDoc()