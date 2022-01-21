"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const controller_1 = __importDefault(require("../structure/controller"));
const signInNavigation_1 = require("../navigations/auth/signInNavigation");
const signUpNavigation_1 = require("../navigations/auth/signUpNavigation");
const changeEmailAndPassword_1 = require("../navigations/auth/changeEmailAndPassword");
const resetPassword_1 = require("../navigations/auth/resetPassword");
class AuthController extends controller_1.default {
    signIn(req, res) {
        this.runNavigation(signInNavigation_1.signInNavigation, req, res);
    }
    signUp(req, res) {
        this.runNavigation(signUpNavigation_1.signUpNavigation, req, res);
    }
    resetPassword(req, res) {
        this.runNavigation(resetPassword_1.resetPasswordNavigation, req, res);
    }
    changeEmailAndPassword(req, res) {
        this.runNavigation(changeEmailAndPassword_1.changeEmailAndPasswordNavigation, req, res);
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map