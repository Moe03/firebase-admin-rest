import { initFirebaseRest } from "../firebase-auth-utils/initFirebase";
import { DirectionOpREST, FirebaseAdminConfig, WhereFilterOpREST } from "../types";

/**
 * Represents a Firebase Admin REST client.
 */
export class FirebaseAdminRest {
    private isCollectionCalled: boolean = false;
    private isDocCalled: boolean = false;

    /**
     * The path of the document.
     */
    public docPath: string = "";

    /**
     * The path of the collection.
     */
    public collectionPath: string = "";

    /**
     * Initializes a new instance of the FirebaseAdminRest class.
     * @param initialValue - Optional initial value for the FirebaseAdminConfig.
     */
    constructor(initialValue?: FirebaseAdminConfig) {
        initFirebaseRest();
        return this;
    }

    /**
     * Sets the path of the document.
     * @param docPath - The path of the document.
     * @returns The current instance of FirebaseAdminRest.
     */
    doc(docPath: string): DocOperations {
        if (this.isCollectionCalled) {
            throw new Error("Cannot call .doc() after .collection()");
        }
        this.isDocCalled = true;
        this.docPath = docPath;
        return new DocOperations(this.docPath);
    }

    /**
     * Sets the path of the collection.
     * @param collectionPath - The path of the collection.
     * @returns The current instance of FirebaseAdminRest.
     */
    collection(collectionPath: string): CollectionOperations {
        if (this.isDocCalled) {
            throw new Error("Cannot call .collection() after .doc()");
        }
        this.isCollectionCalled = true;
        this.collectionPath = collectionPath;
        return new CollectionOperations(this.collectionPath);
    }

}

/**
 * Nested class for operations related to documents.
 */
class DocOperations {
    constructor(private docPath: string) { }

    // Define methods for document operations here
    public async get(): Promise<string> {
        return `Retrieving document at ${this.docPath}`;
    }
}

/**
 * Nested class for operations related to documents.
 */
class CollectionOperations {

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

    constructor(private collectionPath: string) {
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