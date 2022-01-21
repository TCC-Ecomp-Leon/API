"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const DummyController_1 = require("../controllers/DummyController");
exports.router = express_1.default.Router();
const dummyController = new DummyController_1.DummyController();
exports.router.get('/dummy', dummyController.dummyGet.bind(dummyController));
//# sourceMappingURL=dummy.js.map