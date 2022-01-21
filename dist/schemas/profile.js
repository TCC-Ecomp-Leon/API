"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateInformacoesCursoUniversitario = exports.UpdateProfileValidator = exports.ProfileValidator = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default();
const profile = {
    type: 'object',
    properties: {
        email: { type: 'string' },
        nome: { type: 'string' },
        telefone: { type: 'integer' },
        cpf: { type: 'string' },
    },
    required: ['email', 'nome', 'telefone', 'cpf'],
    additionalProperties: true,
};
const updateProfile = {
    type: 'object',
    properties: {
        email: { type: 'string', nullable: true },
        nome: { type: 'string', nullable: true },
        telefone: { type: 'integer', nullable: true },
        fotoPerfil: { type: 'string', nullable: true },
        cpf: { type: 'string', nullable: true },
    },
    required: [],
    additionalProperties: true,
};
const informacoesUniversitario = {
    type: 'object',
    properties: {
        curso: {
            type: 'object',
            properties: {
                id: { type: 'string' },
            },
            required: ['id'],
            additionalProperties: true,
        },
    },
    required: [],
    additionalProperties: true,
};
exports.ProfileValidator = ajv.compile(profile);
exports.UpdateProfileValidator = ajv.compile(updateProfile);
exports.UpdateInformacoesCursoUniversitario = ajv.compile(informacoesUniversitario);
//# sourceMappingURL=profile.js.map