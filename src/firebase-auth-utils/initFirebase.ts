

import * as jwt from '@tsndr/cloudflare-worker-jwt'
import { FirebaseAdminConfig, FirestoreDatabase } from '../types';

export async function generateJWT(input?: {
    service?: string,
    serviceAccount?: {
        client_email: string;
        private_key: string;
        private_key_id: string;
    }
}) {
    const serviceAccount = input?.serviceAccount || JSON.parse(process.env.GCLOUD_SERVICE_ACCOUNT || '{}');
    // const serviceAccount: {
    //     client_email: string;
    //     private_key: string;
    //     private_key_id: string;
    // } | undefined = JSON.parse(process.env.SERVICE_ACCOUNT || '{}');
    if (!serviceAccount) throw new Error('SERVICE_ACCOUNT not found in environment variables');
    const privateKey = serviceAccount.private_key;
    const signedJwt = await jwt.sign(
        {
            iss: serviceAccount.client_email,
            sub: serviceAccount.client_email,
            //  scope: 'https://www.googleapis.com/auth/datastore',
            aud: `https://${input?.service || 'firestore'}.googleapis.com/`,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 3600, // Expires in 1 hour
        },
        privateKey,
        {
            algorithm: 'RS256',
            header: {
                'kid': serviceAccount.private_key_id,
                'typ': 'JWT',
                'alg': 'RS256',
            },
        });

    return signedJwt;
}

export async function initEdgeFirebase(options: {
    serviceAccount: FirebaseAdminConfig
    databaseId?: string;
}): Promise<FirestoreDatabase> {
    if (options.serviceAccount.project_id === undefined) throw new Error('project_id is required in serviceAccount.');
    const accessToken = await generateJWT({ serviceAccount: options.serviceAccount });
    process.env.FIREBASE_REST_ACCESS_TOKEN = accessToken;
    process.env.FIREBASE_REST_PROJECT_ID = options.serviceAccount.project_id;
    process.env.FIREBASE_REST_DATABASE_ID = options.databaseId || '(default)';
    return {
        name: options.databaseId || '(default)',
        projectId: options.serviceAccount?.project_id,
        accessToken: accessToken
    };
}