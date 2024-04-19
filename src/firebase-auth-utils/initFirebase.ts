import * as jwt from '@tsndr/cloudflare-worker-jwt'
import { InitFirebaseAdminInput, InitFirebaseAdminOuput } from '../types';
import { testFbCredentials } from './testFbCredentials';

/**
 * Generates a JSON Web Token (JWT) for Firebase authentication.
 * @param input - Optional input parameters.
 * @param input.service - The service name. Defaults to 'firestore'.
 * @param input.serviceAccount - The service account credentials.
 * @param input.serviceAccount.client_email - The client email of the service account.
 * @param input.serviceAccount.private_key - The private key of the service account.
 * @param input.serviceAccount.private_key_id - The private key ID of the service account.
 * @returns The signed JWT.
 * @throws Error if the service account is not found in environment variables.
 */
export async function generateJWT(input?: {
    service?: string,
    serviceAccount?: {
        client_email: string;
        private_key: string;
        private_key_id?: string;
    }
}) {
    const serviceAccount = input?.serviceAccount || JSON.parse(process.env.GCLOUD_SERVICE_ACCOUNT || '{}');
    if (!serviceAccount) throw new Error('SERVICE_ACCOUNT not found in environment variables');
    const privateKey = serviceAccount.private_key;
    const signedJwt = await jwt.sign(
        {
            iss: serviceAccount.client_email,
            sub: serviceAccount.client_email,
            aud: `https://${input?.service || 'firestore'}.googleapis.com/`,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 3600, // Expires in 1 hour
        },
        privateKey,
        {
            algorithm: 'RS256',
            header: {
                'kid': serviceAccount.private_key_id || ".",
                'typ': 'JWT',
                'alg': 'RS256',
            },
        });

    return signedJwt;
}

/**
 * Initializes the Firebase REST API by setting the necessary environment variables, you can also not pass any options and it will try to get the service account from the environment variables.
 * @param options - The initialization options.
 * @param options.serviceAccount - The Firebase Admin configuration.
 * @param options.databaseId - The ID of the Firestore database. Defaults to '(default)'.
 * @param options.ignoreUndefinedValues - Whether to ignore undefined values when writing to Firestore. Defaults to false.
 * @returns A promise that resolves to the Firestore database information.
 * @throws Error if the project_id is not provided in the serviceAccount.
 */
export async function initFirebaseRest(options?: InitFirebaseAdminInput): Promise<InitFirebaseAdminOuput> {
    if (options?.serviceAccount === undefined) {
        options = {
            serviceAccount: {
                client_email: process.env.FAR_CLIENT_EMAIL || '',
                project_id: process.env.FAR_PROJECT_ID || '',
                private_key: process.env.FAR_PRIVATE_KEY || ''
            }
        }
    }
    if (!options.serviceAccount.project_id) throw new Error('project_id, client_email, private_key are required in serviceAccount.');
    if (!options.serviceAccount.client_email) throw new Error('project_id, client_email, private_key are required in serviceAccount.');
    if (!options.serviceAccount.private_key) throw new Error('project_id, client_email, private_key are required in serviceAccount.');
    const accessToken = await generateJWT({ serviceAccount: options.serviceAccount });
    process.env.FIREBASE_REST_ACCESS_TOKEN = accessToken;
    process.env.FIREBASE_REST_PROJECT_ID = options.serviceAccount.project_id;
    process.env.FIREBASE_REST_DATABASE_ID = options.databaseId || '(default)';

    if (process.env.NODE_ENV !== 'production') {
        // test if the service account is correct
        const continueNext = await testFbCredentials();
        if (!continueNext) {
            throw new Error('Service account auth failed, please check the service account credentials.');
        }
    }

    return {
        databaseId: options.databaseId || '(default)',
        serviceAccount: options.serviceAccount,
        accessToken: accessToken,
    };
}