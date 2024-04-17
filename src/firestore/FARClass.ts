import { initFirebaseRest } from "../firebase-auth-utils/initFirebase";
import { DirectionOpREST, GetDocumentResponse, InitFirebaseAdminInput, WhereFilterOpREST } from "../types";
import { getDocRest } from "./getDoc";



/**
 * Represents a Firebase Admin REST client.
 */
/**
 * Initializes a new instance of the FirebaseAdminRest class.
 * @param initialValue - Optional initial value for the FirebaseAdminConfig.
 */
export class FirebaseAdminRest<T = any> {

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

    public doc<T = any>(docPath: string): DocOperations<T> {
        return new DocOperations<T>(docPath, this.databaseId);
    }

    public collection<T extends object>(collectionPath: string): CollectionOperations<T> {
        return new CollectionOperations<T>(collectionPath, this.databaseId);
    }
}

/**
 * Nested class for operations related to documents.
 */
class DocOperations<T = any> {
    constructor(private docPath: string, private databaseId: string) { }

    // Define methods for document operations here
    public async get(): Promise<GetDocumentResponse<T>> {
        const doc = await getDocRest(this.docPath, {
            debug: true
        });
        return doc;
    }
}

/**
 * Nested class for operations related to documents.
 */
class CollectionOperations<T> {

    private whereQuery: {
        field: string,
        op: WhereFilterOpREST,
        value: any
    };
    private orderByQuery: {
        field: string,
        direction: DirectionOpREST
    };
    private limitQuery: number;

    constructor(private collectionPath: string, private databaseId: string) {
        this.whereQuery = {
            field: "",
            op: "EQUAL",
            value: ""
        }
        this.orderByQuery = {
            field: "",
            direction: "ASCENDING"
        }
        this.limitQuery = 100;
    }


    public where(field: string, op: WhereFilterOpREST, value: any) {
        this.whereQuery = {
            field: field,
            op: op,
            value: value
        }
        return this;
    }

    public orderBy(field: string, direction: DirectionOpREST) {
        this.orderByQuery = {
            field: field,
            direction: direction
        }
        return this;
    }

    public limit(limit: number) {
        this.limitQuery = limit;
        return this;
    }
    // Define methods for document operations here
    public async get(): Promise<string> {
        return `Retrieving from collection: ${this.collectionPath} with where(): ${this.whereQuery} with orderBy ${this.orderByQuery} with limit ${this.limitQuery} at ${this.collectionPath}`;
    }
}