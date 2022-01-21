"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeEmailAndPasswordNavigation = void 0;
const changeEmailAndPassword_1 = require("../../handlers/auth/changeEmailAndPassword");
const navigation_1 = require("../../structure/navigation");
exports.changeEmailAndPasswordNavigation = navigation_1.ProtectedNavigation([
    changeEmailAndPassword_1.changeEmailAndPasswordHandler,
]);
//# sourceMappingURL=changeEmailAndPassword.js.map