"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordNavigation = void 0;
const resetPassword_1 = require("../../handlers/auth/resetPassword");
const navigation_1 = __importDefault(require("../../structure/navigation"));
exports.resetPasswordNavigation = new navigation_1.default([resetPassword_1.resetPasswordHandler]);
//# sourceMappingURL=resetPassword.js.map