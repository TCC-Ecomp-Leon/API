"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MensagemValidator = exports.DuvidaValidator = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({
    allowUnionTypes: true,
    timestamp: 'date',
});
const informacoesDuvida = {
    type: 'object',
    properties: {
        titulo: { type: 'string' },
        descricao: { type: 'string' },
        idCurso: { type: 'string' },
        idMateria: { type: 'string', nullable: true },
        primeiraMensagem: { type: 'string' },
        idCursoUniversitario: { type: 'string', nullable: true },
    },
    required: [
        'titulo',
        'descricao',
        'idCurso',
        'idMateria',
        'primeiraMensagem',
        'idCursoUniversitario',
    ],
    additionalProperties: true,
};
const mensagemDuvida = {
    type: 'object',
    properties: {
        mensagem: { type: 'string' },
    },
    required: ['mensagem'],
    additionalProperties: true,
};
exports.DuvidaValidator = ajv.compile(informacoesDuvida);
exports.MensagemValidator = ajv.compile(mensagemDuvida);
//# sourceMappingURL=duvida.js.map