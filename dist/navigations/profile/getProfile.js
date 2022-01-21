"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfileNavigation = void 0;
const getProfile_1 = require("../../handlers/profile/getProfile");
const navigation_1 = require("../../structure/navigation");
exports.getProfileNavigation = navigation_1.ProtectedNavigation([getProfile_1.getProfileHandler]);
//# sourceMappingURL=getProfile.js.map