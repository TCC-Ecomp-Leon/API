"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProfileNavitation = void 0;
const deleteProfileHandler_1 = require("../../handlers/profile/deleteProfileHandler");
const navigation_1 = require("../../structure/navigation");
exports.deleteProfileNavitation = navigation_1.ProtectedNavigation([
    deleteProfileHandler_1.deleteProfileHandler,
]);
//# sourceMappingURL=deleteProfile.js.map