"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordHandler = void 0;
const firebaseAuth_1 = require("../../services/authentification/firebaseAuth");
const handler_1 = __importDefault(require("../../structure/handler"));
exports.resetPasswordHandler = new handler_1.default(async (context) => {
    const email = context.params['email'];
    const request = await firebaseAuth_1.requestResetPassword(email);
    if (!request.success) {
        throw request.error;
    }
    return {
        status: 200,
        body: null,
    };
});
//# sourceMappingURL=resetPassword.js.map