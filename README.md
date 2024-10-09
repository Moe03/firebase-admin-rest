NOT ACTIVELY MAINTAINED.

### If you want to collab or sponsor this please dm @moe_03 on discord.

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
const docs = await db.collection<User>(`users`).limit(10).page(2).get(); 
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

### Package size
![image](https://github.com/Moe03/firebase-admin-rest/assets/56455612/eca03b8e-1e80-45ab-92ac-6c3020937d8a)

NOT Actively maintained temporary solution till main firebase sdk team creates a lite version or something that works with any JS env.

Contribute however you'd like :)

## License
MIT
