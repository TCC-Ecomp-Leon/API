"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtualizarProjetoValidator = exports.RegistroProjetoValidator = void 0;
const ajv_1 = __importDefault(require("ajv"));
const endereco_1 = require("./endereco");
const ajv = new ajv_1.default();
const registroProjeto = {
    type: 'object',
    properties: {
        nome: { type: 'string' },
        descricao: { type: 'string' },
        email: { type: 'string' },
        telefone: { type: 'integer' },
        imgProjeto: { type: 'string' },
        endereco: endereco_1.schemaEndereco,
    },
    required: [
        'nome',
        'descricao',
        'email',
        'telefone',
        'imgProjeto',
        'endereco',
    ],
    additionalProperties: true,
};
const informacoesProjeto = {
    type: 'object',
    properties: {
        nome: { type: 'string', nullable: true },
        descricao: { type: 'string', nullable: true },
        telefone: { type: 'integer', nullable: true },
        endereco: { ...endereco_1.schemaEndereco, nullable: true },
        imgProjeto: { type: 'string', nullable: true },
    },
    required: [],
    additionalProperties: true,
};
exports.RegistroProjetoValidator = ajv.compile(registroProjeto);
exports.AtualizarProjetoValidator = ajv.compile(informacoesProjeto);
//# sourceMappingURL=projeto.js.map