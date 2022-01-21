"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileController = void 0;
const controller_1 = __importDefault(require("../structure/controller"));
const getUserProfile_1 = require("../navigations/profile/getUserProfile");
const getProfile_1 = require("../navigations/profile/getProfile");
const updateProfile_1 = require("../navigations/profile/updateProfile");
const deleteProfile_1 = require("../navigations/profile/deleteProfile");
class ProfileController extends controller_1.default {
    getUserProfile(req, res) {
        this.runNavigation(getUserProfile_1.getUserProfileNavigation, req, res);
    }
    getProfile(req, res) {
        this.runNavigation(getProfile_1.getProfileNavigation, req, res);
    }
    updateProfile(req, res) {
        this.runNavigation(updateProfile_1.updateProfileNavigation, req, res);
    }
    deleteProfile(req, res) {
        this.runNavigation(deleteProfile_1.deleteProfileNavitation, req, res);
    }
}
exports.ProfileController = ProfileController;
//# sourceMappingURL=ProfileController.js.map