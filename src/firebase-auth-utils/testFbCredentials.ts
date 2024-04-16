import { generateFirebaseReqHeaders } from "../firestore/utils";
import { TypedEnv } from "../types";

export async function testFbCredentials() {
    try {
        const typedEnv = { ...process.env } as TypedEnv
        const response: any = await fetch(`https://firestore.googleapis.com/v1beta1/projects/${typedEnv.FIREBASE_REST_PROJECT_ID}/databases/${typedEnv.FIREBASE_REST_DATABASE_ID}/documents/test/test`, {
            method: 'GET',
            headers: generateFirebaseReqHeaders()
        }
        );
        // console.log(response)
        if(response.status === 401 || response.status === 403){
            console.error('Invalid service account credentials')
            return false
        }else{
            return true
        }
    } catch (error) {
        console.error('Error has occured init fireabse..')
        return false
    }
} 