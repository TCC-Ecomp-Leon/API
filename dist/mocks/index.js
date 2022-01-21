"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const perfil_1 = __importDefault(require("./perfil"));
const projeto_1 = __importDefault(require("./projeto"));
console.log('initializing mocks');
perfil_1.default().then(() => {
    projeto_1.default().then();
});
console.log('finishing mocks');
//# sourceMappingURL=index.js.map