import { initFirebaseRest } from "../firebase-auth-utils/initFirebase";
import { CollectionOperationsInstance, DirectionOpREST, GetDocumentRes, GetDocumentsRes, InitFirebaseAdminInput, OrderByDirection, toJsonResponse, WhereFilterOp, WhereFilterOpREST } from "../types";
import { getDocRest } from "./getDoc";
import { queryDocsRest } from "./queryDocs";
import { orderOpToRest, removeFirstAndLastSlash, whereOpToRest } from "./utils";
import { setDocRest } from "./setDoc";
import { DJDeleteREST, DocsToJSONRest, JSONtoDocsRest } from "./helper_utils/DJUtils";
import { deleteDocRest } from "./deleteDoc";

/**
 * Nested class for operations related to documents.
 */
class FirestoreOperations {

    constructor(public databaseId: string) {
        return this;
    }
    /**
    * Update a document in Firestore.
    * @param {Object} docPath - Additional options for the operation.
    * @template T - The type of the document data.
    * @returns {DocOperations<T>} Document operations instance.
    */
    public doc<T extends object>(docPath: string): DocOperations<T> {
        return new DocOperations<T>(removeFirstAndLastSlash(docPath), this.databaseId);
    }

    /**
    * Update a document in Firestore.
    * @param {T} data - The data to set in the document.
    * @param {Object} options - Additional options for the operation.
    * @param {boolean} options.merge - Whether to merge the data with the existing document. Defaults to false.
    * @returns {Promise<CompatibleDocument<T>>} A Promise that resolves to a response object containing fetched Firestore document.
    */
    public collection<T extends object>(collectionPath: string): CollectionOperationsInstance<T> {
        return new CollectionOperations<T>(removeFirstAndLastSlash(collectionPath), this.databaseId)
    }
}

/**
 * Nested class for operations related to documents.
 */
class DocOperations<T extends object> {
    constructor(public docPath: string, public databaseId: string) { }
    /**
    * Update a document in Firestore.
    * @param {T} data - The data to set in the document.
    * @param {Object} options - Additional options for the operation.
    * @param {boolean} options.merge - Whether to merge the data with the existing document. Defaults to false.
    * @returns {Promise<CompatibleDocument<T>>} A Promise that resolves to a response object containing fetched Firestore document.
    */
    public async update(data: T): Promise<GetDocumentRes<T>> {
        // Implement update operation here
        const updateDocRes = await setDocRest(this.docPath, data, {
            merge: true,
            db: this.databaseId
        });
        return updateDocRes;
    }

    /**
    * Set a document in Firestore.
    * @param {T} data - The data to set in the document.
    * @param {Object} options - Additional options for the operation.
    * @param {boolean} options.merge - Whether to merge the data with the existing document. Defaults to false.
    * @returns {Promise<CompatibleDocument<T>>} A Promise that resolves to a response object containing fetched Firestore document.
    */
    public async set(data: T, options?: { merge: boolean }): Promise<GetDocumentRes<T>> {
        // Implement set operation here
        const setDocRes = await setDocRest(this.docPath, data, {
            ...options,
            db: this.databaseId
        });
        return setDocRes;
    }

    /**
    * Runs a query to get the document.
    * @return {Promise<GetDocumentRes<T>>} A Promise that resolves to a response object containing fetched Firestore document.
    */
    public async get(): Promise<GetDocumentRes<T>> {
        const doc = await getDocRest(this.docPath, {
            db: this.databaseId,
            debug: false
        });
        return doc;
    }

    /**
     * Deletes a document from Firestore.
     * @return {Promise<GetDocumentRes<T>>} A Promise that resolves to a response object containing fetched Firestore document.
     * @param {Object} options - Additional options for the operation.
     */
    public async delete(): Promise<any> {
        const response = await deleteDocRest(this.docPath, {
            db: this.databaseId,
        });
        return response;
    }
}


class CollectionOperations<T extends object> implements CollectionOperationsInstance<T> {
    public whereQueries: {
        field: string,
        op: WhereFilterOpREST,
        value: any
    }[];
    public orderByQuery: {
        field: string,
        direction: DirectionOpREST
    };
    public limitQuery: number;
    public pageQuery: number;

    constructor(public collectionPath: string, public databaseId: string) {
        this.whereQueries = [];
        this.orderByQuery = {
            field: "",
            direction: "ASCENDING"
        }
        this.limitQuery = 100;
        this.pageQuery = 1;
    }


    /**
    * Limit query results.
    * @param {string} field - The field to order the query by.
    * @param {WhereFilterOp} op - The direction to order the query by.
    * @param {any} value - The value to compare the field to.
    */
    public where(field: string, op: WhereFilterOp, value: any) {
        this.whereQueries.push({
            field: field,
            op: whereOpToRest(op),
            value: value
        })
        return this;
    }

    /**
    * Limit query results.
    * @param {string} field - The field to order the query by.
    * @param {OrderByDirection} direction - The direction to order the query by.
    */
    public orderBy(field: string, direction: OrderByDirection) {
        this.orderByQuery = {
            field: field,
            direction: orderOpToRest(direction)
        }
        return this;
    }

    /**
    * Limit query results.
    * @param {number} limit - The number of documents to limit the query to.
    */
    public limit(limit: number) {
        this.limitQuery = limit;
        return this;
    }

    /**
    * Deletes an ENTIRE COLLECTION.
    */
    public async delete() {
        // Implement delete operation here
        const deleteCollectionRes = await DJDeleteREST(this.collectionPath, {
            db: this.databaseId
        });
        return deleteCollectionRes;
    }

    /**
    * Page through the collection.
    * @param {number} page - The page number to retrieve.
    */
    public page(page: number) {
        // Implement pagination here
        this.pageQuery = page;
        return this;
    }

    /**
    * !!WARNING: Experimental feature, use with caution !!
    * This converts a collection to a JSON string to save bandwidth, to store analytics for example without querying hundreds or thousands of documents.
    * Always outputs an array similar to the collection.get() operation.
    */
    public async tojson(): Promise<toJsonResponse> {
        // Implement tojson operation here
        const arrayRes = await DocsToJSONRest<T>(this.collectionPath, {
            db: this.databaseId
        });
        return arrayRes;
    }

    /**
   * !!WARNING: Experimental feature, use with caution !!
   * This converts a collection to a JSON string to save bandwidth, to store analytics for example without querying hundreds or thousands of documents.
   * Always outputs an array similar to the collection.get() operation.
   * @param {T[]} data - The array to convert to store in the collection with the DB engine.
   */
    public async todocs(data: T[]) {
        const writeRes = await JSONtoDocsRest<T>(this.collectionPath, data, {
            db: this.databaseId
        });
        return writeRes;
    }

    /**
     * Get documents from the collection.
     * @return {Promise<GetDocumentsRes<T>>} A Promise that resolves to a response object containing fetched Firestore document.
     */
    public async get(): Promise<GetDocumentsRes<T>> {
        let docsRes;
        // if (!this.whereQueries.length && !this.orderByQuery.field) {
        //     docsRes = await getDocsRest(this.collectionPath, {
        //         limit: this.limitQuery,
        //         db: this.databaseId
        //     });
        // } else {
        docsRes = await queryDocsRest<T>(this.collectionPath, {
            where: this.whereQueries,
            orderBy: this.orderByQuery,
            limit: this.limitQuery,
            db: this.databaseId,
            page: this.pageQuery
        });
        // }
        return docsRes;
    }
}

/**
 * Initializes a new instance of the FirebaseAdminRest class.
 * @param {InitFirebaseAdminInput | undefined} initialValue - Optional initial value for the FirebaseAdminConfig.
 */
export default class RestFirestoreInstance {

    public initialValue: InitFirebaseAdminInput | undefined;

    constructor(initialValue?: InitFirebaseAdminInput) {
        this.initialValue = initialValue;
        return this;
    }

    /**
     * Initializes the Firebase Rest Admin SDK.
     * @returns {FirestoreOperations} A new instance of the FirestoreOperations class.
     */
    async firestore() {
        const appInstance = await initFirebaseRest(this.initialValue);
        return new FirestoreOperations(appInstance.databaseId);
    }
}
