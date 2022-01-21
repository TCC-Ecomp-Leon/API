"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dummyGetNavigation = void 0;
const dummyGetHandler_1 = require("../../handlers/dummy/dummyGetHandler");
const navigation_1 = __importDefault(require("../../structure/navigation"));
exports.dummyGetNavigation = new navigation_1.default([dummyGetHandler_1.dummyGetHandler]);
//# sourceMappingURL=dummyGetNavigation.js.map