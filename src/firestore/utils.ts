import { FirestoreDocument, TypedEnv } from "../types";

export function humanValueToDumbGoogle(value: any): FirestoreDocument {
    switch (typeof value) {
        case 'string':
            return { stringValue: value };
        case 'number':
            if (
                Number.isInteger(value)
            ) {
                return { integerValue: value };
            }
            return { doubleValue: value };
        case 'boolean':
            return { booleanValue: value };
        case 'object':
            if (Array.isArray(value)) {
                return { arrayValue: { values: value.map((v) => humanValueToDumbGoogle(v)) } }
            }
            return { mapValue: { fields: Object.keys(value).reduce((acc, k) => ({ ...acc, [k]: humanValueToDumbGoogle(value[k]) }), {}) } }
        case null:
            return { nullValue: null };
        default:
            return value;
    }
}

export function humanObjectToDumbGoogle(inputObject: any) {
    let fields: {
        [key: string]: FirestoreDocument
    } = {};
    for (const key in inputObject) {
        if (inputObject.hasOwnProperty(key)) {
            const value = inputObject[key];
            fields[key] = humanValueToDumbGoogle(value);
        }
    }
    return fields;
}

export function googleDumbObjectToHuman(inputObject: {
    [key: string]: FirestoreDocument
}) {
    let fields: {
        [key: string]: any
    } = {};
    for (const key in inputObject) {
        if (inputObject.hasOwnProperty(key)) {
            const value = inputObject[key];
            // console.log(`map`, value)
            if (value['arrayValue']) {
                fields[key] = value.arrayValue?.values?.map((value) => {
                    if (value['mapValue']) {
                        return googleDumbObjectToHuman(value.mapValue.fields)
                    } else {
                        return googleDumbValueToHuman(value)
                    }
                })
            } else if (value['mapValue']) {
                fields[key] = googleDumbObjectToHuman(value?.mapValue?.fields || {});
            }
            else {
                fields[key] = googleDumbValueToHuman(value);
            }
        }
    }
    return fields;
}

export function googleDumbValueToHuman(inputObject: {
    [key: string]: any
}) {
    for (const key in inputObject) {
        if (inputObject.hasOwnProperty(key)) {
            const value = inputObject[key];
            switch (key) {
                case 'stringValue':
                    return value;
                case 'integerValue':
                    return Number(value);
                case 'booleanValue':
                    return value;
                case "nullValue":
                    return null;
                default:
                    return value;
            }
        }
    }
}

export function formatValuesWithType(responseFB: {
    name: string,
    fields: {
        [key: string]: FirestoreDocument
    }
}) {
    // console.log(inputObject)
    // console.log(`responseFB: `, responseFB)
    const id = responseFB?.name ? responseFB?.name?.split('/').pop() : undefined;
    const inputObject = responseFB?.fields;
    try {
        return { id: id, ...googleDumbObjectToHuman(inputObject) };
    } catch (error) {
        console.log(`error in formatValuesWithType: `, error)
        return {}
    }
}

export function generateFirebaseReqHeaders(db?: string) {
    const typedEnv = process.env as TypedEnv;
    return {
        "Authorization": "Bearer " + typedEnv.FIREBASE_REST_ACCESS_TOKEN,
        "x-goog-request-params": `project_id=${typedEnv.FIREBASE_REST_PROJECT_ID}&database_id=${typedEnv.FIREBASE_REST_DATABASE_ID || db || "(default)"}`
    }
}

export function removeFirstAndLastSlash(str: string): string {
    if (str.length >= 2 && str.startsWith('/') && str.endsWith('/')) {
        return str.substring(1, str.length - 1);
    }
    return str;
}

export function generateRandomId(length?: number) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < (length || 15); i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
}