import { initEdgeFirebase } from "../firestore";

export const testAdminConfig = {
    "type": "service_account",
    "project_id": "speakwiz-app",
    "private_key_id": "2e83211104d89eb0312536a06381e2dc5b209d1c",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDDTmmhi4J8hRCZ\nTN7LtlHhaDyBV1niKYPmIU3ekqqjq8hj3nEFw9CmlS1cSr9mTRdi16sQbdm+AaM1\ntZfvPh27Ft2V5qUMDIiAomUU8kWJGpoj27r2ZTX96ePFhFbStsNJwH2sLRZ5/jrl\nmni8mE5FISshkHnnXGz1qEGLymmhiF8S3iq03/yZ/9SChSKvI51XG/ayjMALc61J\nJN1+k0IcLSythF3RlNF5NxlU5vCEWhdC2jhbZ4ZXyeoVoN+LRuk7M/CZmy2dDVNk\nr/DwjgfSgOZFAoNqJiKF/ryI6cD79RvZSHS+RlRxZeGC2hwOV11w9eoa07pLHvl0\nr6B2N2FzAgMBAAECggEATpQ968E1vuPKyeMjwNKaHxbRQTjj8RrC9tRvgB2CileT\nSJs23hrq2BstJPTuDTr3Lc2YBgQsl0YRZIqrlpZnX97TSHyD61UflqHACa1wTLln\nSwYdMwWFs6NnARE93YmrCQFpjtyVLoAbMkX0Tez5kNbHg7mdUnjdXflUZeoKlfKT\nj5lUvi3xLlKPcPH5SE3Cz7fN5vDb/2iGBEh7SwiynwjAWhxrUOCv2fhax73swzFX\nWRVU7oPJF+Z0/Df02CnlVnS15//Na1Y4IJt2grb0GES3WaAeTB1wCaplph8gaCgc\n45eqQy1Cucaw+ofR8YZADAGJMRtV1BNDENKkWlCwAQKBgQD15RQM0l7D9fXp5kcv\neWgKv3a33MceIFUqG+UG+hWEgd0SmQVrTWXQmWMOhbGghMqQ+zVY2HVq5aQA8vsg\n9ijLtL+P4UyuZrFPzDezPmX6G5ruYL0z+LbACqWlvOlKv0c0IRtx3ah52gBTw6HQ\ncivqPI4O0/KYVQsgBBYT5LKXmwKBgQDLVR7j3sAj3IvNX1XF5/6STmCbvY0Pbi6d\ndc7BM6z8mH5mKzTz8M4Qdc6PKHGyKYVTOillsBCioicHPssryQNr0CS5S6suo19l\n3AH1U0S5ruPz3nNejDHoUNbD/ugqXEkyKz0INYOzERd3/M3r/D7aLFAKAizfA/hI\n7yV1w1V3CQKBgQClJPAdWGBa/eLl70mZ4dD1fveNrpJwckigWlGsKOOwtcMzDWBt\nW3Lo8Uts4m+Unfqp+n0uqVnarFZEaOwujASEI2WQjUEB1Gh7bm1uTZcRrd6VAJWx\nxPV/7uandEO+ds6sfRvAkpznEXmsyDPyGevSik7iOIiytFMfcn8dZzhmxwKBgErs\nea5zxQ8x1F3/1CZRvy+AK/8XUKQv8INbBq2Qchy9wE27fA6rW/Maxdtghsykmhk5\n5EkxIGAdKg50Z/8hWd5fWzjgFhrgXmW1NQ+F+FwHgr246YAcXsOBDjI4eqopSVtw\nLVQaDAZutNwkzmg3kZ1pGLEnbgtbdiDB5mbHbHWpAoGBAOG82JoscKQdaz9ilsiK\niHIkZ/YnHvesqATyLKFLU+tG/2hgJqCftTbm9fdlrDFK0aOaqQlmfGslPkDNOMqi\npHZ0sMitDOpakSCRtd6tAHymuHZFNQPsJjNFKDI+Nw+J1sIHHkzvmVcNDwpAjst6\n2Q/uKBAy6MkeSxrTuvChEoEQ\n-----END PRIVATE KEY-----\n",
    "client_email": "vg-rest@speakwiz-app.iam.gserviceaccount.com",
    "client_id": "103588609938596427689",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/vg-rest%40speakwiz-app.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
}

initEdgeFirebase({
    serviceAccount: testAdminConfig
}).then((res) => {
    console.log(`access token: ${process.env.GCLOUD_ACCESS_TOKEN}`)
})