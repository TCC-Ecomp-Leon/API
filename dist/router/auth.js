"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const AuthController_1 = require("../controllers/AuthController");
exports.router = express_1.default.Router();
const authController = new AuthController_1.AuthController();
exports.router.put('/auth/sign', authController.signIn.bind(authController));
exports.router.post('/auth/sign', authController.signUp.bind(authController));
exports.router.post('/auth/reset-password/:email', authController.resetPassword.bind(authController));
exports.router.put('/auth/change-email-and-password', authController.changeEmailAndPassword.bind(authController));
//# sourceMappingURL=auth.js.map