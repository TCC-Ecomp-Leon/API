"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginValidator = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default();
const loginSchema = {
    type: 'object',
    properties: {
        email: { type: 'string' },
        password: { type: 'string' },
    },
    required: ['email', 'password'],
    additionalProperties: true,
};
exports.LoginValidator = ajv.compile(loginSchema);
//# sourceMappingURL=login.js.map