"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileNavigation = void 0;
const udpateProfileValidator_1 = require("../../handlers/profile/udpateProfileValidator");
const updateProfile_1 = require("../../handlers/profile/updateProfile");
const navigation_1 = require("../../structure/navigation");
exports.updateProfileNavigation = navigation_1.ProtectedNavigation([
    udpateProfileValidator_1.updateProfileValidatorHandler,
    updateProfile_1.updateProfileHandler,
]);
//# sourceMappingURL=updateProfile.js.map