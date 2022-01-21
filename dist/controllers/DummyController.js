"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DummyController = void 0;
const dummyGetNavigation_1 = require("../navigations/dummy/dummyGetNavigation");
const controller_1 = __importDefault(require("../structure/controller"));
class DummyController extends controller_1.default {
    dummyGet(req, res) {
        this.runNavigation(dummyGetNavigation_1.dummyGetNavigation, req, res);
    }
}
exports.DummyController = DummyController;
//# sourceMappingURL=DummyController.js.map