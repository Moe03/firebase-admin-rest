import { OrderByDirection, WhereFilterOp } from "@google-cloud/firestore";
import { initFirebaseRest } from "../firebase-auth-utils/initFirebase";
import { CompatibleDocument, DirectionOpREST, GetDocumentResponse, InitFirebaseAdminInput, RestDocuments, WhereFilterOpREST } from "../types";
import { getDocRest } from "./getDoc";
import { getDocsRest } from "./getDocs";
import { queryDocsRest } from "./queryDocs";
import { orderOpToRest, whereOpToRest } from "./utils";
import { setDocRest } from "./setDoc";



/**
 * Represents a Firebase Admin REST client.
 */
/**
 * Initializes a new instance of the FirebaseAdminRest class.
 * @param initialValue - Optional initial value for the FirebaseAdminConfig.
 */
export class RestFirestoreInstance<T = any> {

    private initialValue: InitFirebaseAdminInput | undefined;

    constructor(initialValue?: InitFirebaseAdminInput) {
        this.initialValue = initialValue;
        return this;
    }

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
        return new DocOperations<T>(docPath, this.databaseId);
    }

    public collection<T extends object>(collectionPath: string): CollectionOperations<T> {
        return new CollectionOperations<T>(collectionPath, this.databaseId);
    }
}

/**
 * Nested class for operations related to documents.
 */
class DocOperations<T extends object> {
    constructor(private docPath: string, private databaseId: string) { }

    public async update(data: T): Promise<CompatibleDocument<T>> {
        // Implement update operation here
        const updateDocRes = await setDocRest(this.docPath, data, {
            merge: true,
            db: this.databaseId
        });
        return updateDocRes;
    }

    public async set(data: T, options?: { merge: boolean }): Promise<CompatibleDocument<T>> {
        // Implement set operation here
        const setDocRes = await setDocRest(this.docPath, data, {
            ...options,
            db: this.databaseId
        });
        return setDocRes;
    }

    // Define methods for document operations here
    public async get(): Promise<GetDocumentResponse<T>> {
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

    public page(page: number) {
        // Implement pagination here
        this.pageQuery = page;
        return this;
    }

    // Define methods for document operations here
    public async get(): Promise<RestDocuments<T>> {
        let docsRes;
        if (!this.whereQueries.length && !this.orderByQuery.field) {
            docsRes = await getDocsRest(this.collectionPath, {
                limit: this.limitQuery,
                db: this.databaseId
            });
        } else {
            docsRes = await queryDocsRest<T>(this.collectionPath, {
                where: this.whereQueries,
                orderBy: this.orderByQuery,
                limit: this.limitQuery,
                db: this.databaseId,
                page: this.pageQuery
            });
        }
        return docsRes;
    }
}