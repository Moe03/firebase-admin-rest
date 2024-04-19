### EXPERIMENTAL -- PLEASE UPDATE REGULARLY 
```bash
npm i firebase-admin-rest@latest 
```

### **Tiny Typesafe Firebase Admin REST API wrapper that works on Vercel Edge functions, Bun, Cloudflare workers, Deno or any JS runtime.**

### Background:
- Provide a common SDK that can be used in any JS environment without problems unlike the firebase-admin sdk.
- Typesafe out of the box, till now have implemented:
    - ~~Firestore~~
    - Storage
    - Authentication
    - Realtime DB
- Goal is to have the *almost* the same structure so you don't have to rewrite any code, you copy and paste the code you already built in firebase-admin and it will work magically 👌
```ts
// firebase-admin
const db = app.firestore();
const docs = await db.collection(`users`).limit(10).get()

// firebase-admin-rest
const db = await initFirebaseRest().firestore();
const docRef = await db.doc<User>(`users`).limit(10).page(2).get(); 
```
Typesafe + helper functions like pagination!

# **Get Started**
```bash
npm i firebase-admin-rest@latest

```

## Authorization:
- You can either setup an ENV then be able to directly call the sdk:
```env
FAR_PROJECT_ID="PROJECT_ID"
FAR_CLIENT_EMAIL="SERVICE_ACCOUNT_CLIENT_EMAIL"
FAR_PRIVATE_KEY="SERVICE_ACCOUNT_PRIVATE_KEY"
```
```ts
const db = await initFirebaseRest().firestore();

const docRef = await db.doc(`users/test_1`).get();

console.log(docRef.data())
```
- Or you can initalise the firestore instance with the service account object:
```ts
// TODO: Replace the following with your app's Firebase project configuration
const serviceAccount = {
  //...
};
const db = await initFirebaseRest({
    serviceAccount: serviceAccount, // service acccount config
    databaseId: '(default)', // change it to a custom db
}).firestore();

const docRef = await db.doc(`users/test_1`).get();

console.log(docRef.data())
```
#### **Get a Document**
```ts
async function getDoc() {
    const db = await initFirebaseRest().firestore();
    const docRef = await db.doc(`users/test_1`).get();

    console.log(docRef.data())
}
getDoc();
```

#### **Get Documents**
```ts
async function getDocs() {
    const db = await initFirebaseRest().firestore();
    const docsRef = await db.collection('users').limit(10).get();

    docsRef.docs.forEach(element => {
        console.log(element.data())
    });
}
getDocs()
```
#### **Query Documents**
```ts
async function queryDocs1() {
    const db = await initFirebaseRest().firestore();
    const docsRef = await db.collection<any>('users').where('age', '>', 25).get();

    docsRef.docs.forEach(element => {
        const user = element.data();
        console.log(user?.name)
    });
}
queryDocs1()
```

#### Complex queries:
By default if a query requires an index to be created we also handle error handling and output the URL to create the index right away during development.
```ts
async function queryDocs2() {
    const db = await initFirebaseRest().firestore();
    const docsRef = await db.collection<any>('users').where('name', '==', 'John Doe').orderBy('age', 'desc').get();

    // outputs an error if index is not created..
    docsRef.docs.forEach(element => {
        const user = element.data();
        console.log(user?.name)
    });
}
queryDocs2()
```
#### Query pagination
Out of the box you can simply call .page and you can paginate the results where every page will have the limit you specifed.
```ts
async function queryDocs3() {
    const db = await initFirebaseRest().firestore();
    const docsRef = await db.collection<any>('users').where('age', '>', 25).orderBy('age', 'desc').limit(5).page(3).get(); // 5 items per page

    docsRef.docs.forEach(element => {
        const user = element.data();
        console.log(user?.name)
    });
}
```

### Opinionated helper functions (Experimental)
- Sometimes you have a big amount of data that you need to store somehow but firestore is not quite enough, and buckets are an overkill.. 
- We have created a helper function to reserve a collection to act as a huge document store *(infinite in theory)* where every document read will get (950MB - 1MB) of JSON data.
- This fixes the limits with firestore and at the same time prevents us from using buckets since bandwidth can get expensive quickly.

#### Big JSON to Collection
```ts
async function collectionToDocs() {
    const db = await initFirebaseRest().firestore();
    const docsRef = await db.collection<any>('big_data').todocs(
        Array(50_000).fill(null).map((item, index) => {
            return {
                id: `${Math.random().toString(36).substring(7)}`,
                name: `John Doe ${index}`,
                age: 30,
                email: `atoot@gmail.com`,
            }
        })
    );
    
    console.log(`Done`, docsRef)
} 
collectionToDocs()
```
#### Collection to Big JSON
```ts
async function collectionToJson(){
    const db = await initFirebaseRest().firestore();
    const docsRef = await db.collection(`big_data`).tojson();

    // this will return a JSON object with the same structure as the collection
    // each document read has 1MB of data, so this is a good way to store large data without querying hundreds or thousands of documents
    // storing on a bucket is also an option, but the bandwidth is expensive and will add up
    console.log(docsRef.docReads)
}

collectionToJson()
```

Actively maintained by @Moe03 since I'm using it all the time on edge functions, cloudflare workers and will definitely support more firebase services soon.

Contribute however you'd like :)

## License
MIT

Lib built with bun and generated by:
https://github.com/wobsoriano/bun-lib-starter/generate
