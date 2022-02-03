"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const perfil_1 = __importDefault(require("./perfil"));
const projeto_1 = __importDefault(require("./projeto"));
const runMocks = async () => {
    console.log('initializing mocks');
    await perfil_1.default();
    await projeto_1.default();
    console.log('finishing mocks');
};
runMocks().then(() => {
    process.exit();
});
//# sourceMappingURL=index.js.map