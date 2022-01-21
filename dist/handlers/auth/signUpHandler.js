"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpHandler = void 0;
const firebaseAuth_1 = require("../../services/authentification/firebaseAuth");
const handler_1 = __importDefault(require("../../structure/handler"));
const login_1 = require("../../schemas/login");
const database_1 = require("../../config/database");
const signUpHandler = (validators, customValidators, mountProfile, addProfile) => {
    return new handler_1.default(async (context) => {
        let userToken = undefined;
        try {
            if (!login_1.LoginValidator(context.body)) {
                return {
                    status: 400,
                    body: {
                        error: JSON.stringify(login_1.LoginValidator.errors),
                    },
                };
            }
            const email = context.body['email'];
            const password = context.body['password'];
            for (let i = 0; i < validators.length; i++) {
                const validator = validators[i];
                if (!validator(context.body)) {
                    return {
                        status: 400,
                        body: {
                            error: JSON.stringify(validator.errors),
                        },
                    };
                }
            }
            for (let i = 0; i < customValidators.length; i++) {
                const activation = customValidators[i].activationFunction(context.body);
                if (activation) {
                    const validator = customValidators[i].validator;
                    if (!validator(context.body)) {
                        return {
                            status: 400,
                            body: {
                                error: JSON.stringify(validator.errors),
                            },
                        };
                    }
                }
            }
            const profile = mountProfile(context.body);
            const service = async (db, session) => {
                const registerResult = await firebaseAuth_1.createAuthAccount(email, password);
                if (!registerResult.success) {
                    return {
                        status: 406,
                        body: {
                            error: 'CANT_REGISTER_THAT_PROFILE',
                        },
                    };
                }
                userToken = registerResult.data.token;
                const addProfileResult = await addProfile(registerResult.data.userId, profile, context, db, session);
                if (!addProfileResult.success) {
                    throw addProfileResult.error;
                }
                return {
                    status: 200,
                    body: {
                        authToken: registerResult.data.token,
                    },
                };
            };
            return await database_1.withDatabaseTransaction(service);
        }
        catch (e) {
            if (userToken !== undefined) {
                await firebaseAuth_1.deleteAccount(userToken);
            }
            throw e;
        }
    });
};
exports.signUpHandler = signUpHandler;
//# sourceMappingURL=signUpHandler.js.map