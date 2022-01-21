"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtualizacaoCursoUniversitarioValidator = exports.CursoUniversitarioValidator = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({
    allowUnionTypes: true,
    timestamp: 'date',
});
const cursoUniversitario = {
    type: 'object',
    properties: {
        nome: { type: 'string' },
        descricao: { type: 'string' },
        semestresPrevistos: { type: 'integer' },
        cursoAnterior: {
            type: 'object',
            properties: {
                id: { type: 'string' },
            },
            required: ['id'],
            nullable: true,
            additionalProperties: true,
        },
    },
    required: ['nome', 'descricao', 'semestresPrevistos', 'cursoAnterior'],
    additionalProperties: true,
};
const atualizacaoCursoUniversitario = {
    type: 'object',
    properties: {
        nome: { type: 'string', nullable: true },
        descricao: { type: 'string', nullable: true },
        semestresPrevistos: { type: 'integer', nullable: true },
        cursoAnterior: {
            type: 'object',
            properties: {
                id: { type: 'string' },
            },
            required: ['id'],
            nullable: true,
            additionalProperties: true,
        },
    },
    required: [],
    additionalProperties: true,
};
exports.CursoUniversitarioValidator = ajv.compile(cursoUniversitario);
exports.AtualizacaoCursoUniversitarioValidator = ajv.compile(atualizacaoCursoUniversitario);
//# sourceMappingURL=cursoUniversitario.js.map