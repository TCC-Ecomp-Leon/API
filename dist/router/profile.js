"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const ProfileController_1 = require("../controllers/ProfileController");
exports.router = express_1.default.Router();
const profileController = new ProfileController_1.ProfileController();
exports.router.get('/profile', profileController.getUserProfile.bind(profileController));
exports.router.get('/profile/:id', profileController.getProfile.bind(profileController));
exports.router.put('/profile', profileController.updateProfile.bind(profileController));
exports.router.delete('/profile', profileController.deleteProfile.bind(profileController));
//# sourceMappingURL=profile.js.map