import { OrderByDirection, WhereFilterOp } from "@google-cloud/firestore";
import { initFirebaseRest } from "../firebase-auth-utils/initFirebase";
import { DirectionOpREST, GetDocumentRes, GetDocumentsRes, InitFirebaseAdminInput, toJsonResponse, WhereFilterOpREST } from "../types";
import { getDocRest } from "./getDoc";
import { queryDocsRest } from "./queryDocs";
import { orderOpToRest, removeFirstAndLastSlash, whereOpToRest } from "./utils";
import { setDocRest } from "./setDoc";
import { DJDeleteREST, DocsToJSONRest, JSONtoDocsRest } from "./helper_utils/DJUtils";

/**
 * Initializes a new instance of the FirebaseAdminRest class.
 * @param {InitFirebaseAdminInput} initialValue - Optional initial value for the FirebaseAdminConfig.
 */
export class RestFirestoreInstance<T = any> {

    private initialValue: InitFirebaseAdminInput | undefined;

    constructor(initialValue?: InitFirebaseAdminInput) {
        this.initialValue = initialValue;
        return this;
    }

    /**
     * Initializes the Firebase Rest Admin SDK.
     * @returns {FirestoreOperations} A new instance of the FirestoreOperations class.
     */
    async initApp() {
        const appInstance = await initFirebaseRest(this.initialValue);
        return new FirestoreOperations(appInstance.databaseId);
    }
}

/**
 * Nested class for operations related to documents.
 */
class FirestoreOperations {

    constructor(private databaseId: string) {
        return this;
    }

    public doc<T extends object>(docPath: string): DocOperations<T> {
        return new DocOperations<T>(removeFirstAndLastSlash(docPath), this.databaseId);
    }

    public collection<T extends object>(collectionPath: string): CollectionOperations<T> {
        return new CollectionOperations<T>(removeFirstAndLastSlash(collectionPath), this.databaseId);
    }
}

/**
 * Nested class for operations related to documents.
 */
class DocOperations<T extends object> {
    constructor(private docPath: string, private databaseId: string) { }


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
    */
    public async get(): Promise<GetDocumentRes<T>> {
        const doc = await getDocRest(this.docPath, {
            db: this.databaseId,
            debug: false
        });
        return doc;
    }
}

/**
 * Nested class for operations related to documents.
 */
/**
 * Represents a collection operations class for Firestore.
 * Provides methods for querying and manipulating documents in a collection.
 * @template T - The type of the documents in the collection.
 */
class CollectionOperations<T extends object> {

    private whereQueries: {
        field: string,
        op: WhereFilterOpREST,
        value: any
    }[];
    private orderByQuery: {
        field: string,
        direction: DirectionOpREST
    };
    private limitQuery: number;
    private pageQuery: number;

    constructor(private collectionPath: string, private databaseId: string) {
        this.whereQueries = [];
        this.orderByQuery = {
            field: "",
            direction: "ASCENDING"
        }
        this.limitQuery = 100;
        this.pageQuery = 1;
    }


    public where(field: string, op: WhereFilterOp, value: any) {
        this.whereQueries.push({
            field: field,
            op: whereOpToRest(op),
            value: value
        })
        return this;
    }

    public orderBy(field: string, direction: OrderByDirection) {
        this.orderByQuery = {
            field: field,
            direction: orderOpToRest(direction)
        }
        return this;
    }

    public limit(limit: number) {
        this.limitQuery = limit;
        return this;
    }

    public async delete() {
        // Implement delete operation here
        const deleteCollectionRes = await DJDeleteREST(this.collectionPath, {
            db: this.databaseId
        });
        return deleteCollectionRes;
    }

    public page(page: number) {
        // Implement pagination here
        this.pageQuery = page;
        return this;
    }

    /**
    * !! WARNING: Experimental feature, use with caution !!
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
   * !! WARNING: Experimental feature, use with caution !!
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

    // Define methods for document operations here
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
 * This converts a collection to a store that saves bandwidth, to store analytics for example without querying hundreds or thousands of documents.
 */
class DJOperations<T extends object> {
    get() {
        // Implement get operation here
    }
}