/**
 * Firebase Admin Configuration interface.
 */
export interface FirebaseAdminConfig {
    /**
     * The type of the service account.
     */
    type?: string;
    /**
     * The project ID associated with the service account.
     */
    project_id: string;
    /**
     * The private key ID of the service account.
     */
    private_key_id?: string;
    /**
     * The private key of the service account.
     */
    private_key: string;
    /**
     * The client email of the service account.
     */
    client_email: string;
    /**
     * The client ID of the service account.
     */
    client_id?: string;
    /**
     * The authentication URI for the service account.
     */
    auth_uri?: string;
    /**
     * The token URI for the service account.
     */
    token_uri?: string;
    /**
     * The authentication provider's x509 certificate URL.
     */
    auth_provider_x509_cert_url?: string;
    /**
     * The client's x509 certificate URL.
     */
    client_x509_cert_url?: string;
    /**
     * The universe domain associated with the service account.
     */
    universe_domain?: string;
}

export interface FirestoreDatabase {
    name: string,
    projectId?: string,
    accessToken: string,
}


export interface FirestoreDocument {
    stringValue?: string,
    integerValue?: number,
    doubleValue?: number,
    booleanValue?: boolean,
    arrayValue?: { values: any[] },
    mapValue?: { fields: any },
    nullValue?: null
}

/**
 * Represents a RESTful response object containing a document.
 * @template T - The type of document in the response. Defaults to 'any'.
 * @param exists - The number of documents in the response.
 * @param data - The document data of type T.
 * @param error - Optional. Represents any error information in the response.
 */
export interface CompatibleDocument<T = any> {
    id: string,
    data: () => T,
    error?: any
}

export interface GetDocumentResponse<T = any> {
    id: string,
    exists: () => boolean,
    data: () => T,
    error?: any,
    response?: Response,
    jsonResponse?: object
}

/**
 * Represents a RESTful response object containing documents.
 * @template T - The type of documents in the response. Defaults to 'any'.
 * @param size - The number of documents in the response.
 * @param empty - Indicates whether the response is empty.
 * @param docs - An array of documents of type T.
 * @param error - Optional. Represents any error information in the response.
 */
export interface RestDocuments<T = any> {
    size: number;
    empty: boolean;
    docs: CompatibleDocument<T>[];
    error?: any;
    jsonResponse?: object;
}

export interface TypedEnv {
    FIREBASE_REST_SERVICE_ACCOUNT: string;
    FIREBASE_REST_ACCESS_TOKEN: string;
    FIREBASE_REST_PROJECT_ID: string;
    FIREBASE_REST_DATABASE_ID: string;
    [key: string]: string;
}

export type WhereFilterOpREST = "EQUAL" | "NOT_EQUAL" | "LESS_THAN" | "LESS_THAN_OR_EQUAL" | "GREATER_THAN" | "GREATER_THAN_OR_EQUAL" | "ARRAY_CONTAINS" | "ARRAY_CONTAINS_ANY" | "IN" | "NOT_IN";

export type DirectionOpREST = "ASCENDING" | "DESCENDING";