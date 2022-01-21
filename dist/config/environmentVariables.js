"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
let _initEnv = false;
function default_1() {
    if (!_initEnv) {
        initEnv();
        _initEnv = true;
    }
    let envVariables;
    if (process.env.ENV === 'LOCAL' || process.env.ENV === 'TEST') {
        envVariables = {
            ENV: process.env.ENV,
            JWT_SECRET: process.env.JWT_SECRET,
            MONGODB_URL: process.env.MONGODB_URL,
            ADM_PASSWORD: process.env.ADM_PASSWORD,
        };
    }
    else {
        envVariables = {
            ENV: process.env.ENV == 'PROD' || process.env.ENV == 'BETA'
                ? process.env.ENV
                : undefined,
            MONGODB_URL: process.env.MONGODB_URL,
            FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
            FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
            FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL,
            FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
            FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
            FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
            FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
            FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
            ADM_PASSWORD: process.env.ADM_PASSWORD,
        };
    }
    Object.keys(envVariables).forEach((key) => {
        if (envVariables[key] === undefined) {
            throw Error('Not found ' + key + ' environment variable');
        }
    });
    return envVariables;
}
exports.default = default_1;
function initEnv() {
    dotenv_1.default.config({ path: '.env' });
}
//# sourceMappingURL=environmentVariables.js.map