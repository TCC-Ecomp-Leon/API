"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateAtualizacaoCurso = exports.ValidateCurso = void 0;
const ajv_1 = __importDefault(require("ajv"));
const materia_1 = require("./materia");
const ajv_formats_1 = __importDefault(require("ajv-formats"));
const ajv = new ajv_1.default({
    allowUnionTypes: true,
    timestamp: 'date',
});
ajv_formats_1.default(ajv);
const curso = {
    type: 'object',
    properties: {
        nome: { type: 'string' },
        descricao: { type: 'string' },
        inicioCurso: { type: 'string', format: 'date-time' },
        fimCurso: { type: 'string', format: 'date-time' },
        materias: {
            type: 'array',
            items: materia_1.schemaMateria,
        },
    },
    required: ['nome', 'descricao', 'inicioCurso', 'fimCurso', 'materias'],
    additionalProperties: true,
};
const atualizacaoCurso = {
    type: 'object',
    properties: {
        nome: { type: 'string', nullable: true },
        descricao: { type: 'string', nullable: true },
        inicioCurso: { type: 'string', format: 'date-time', nullable: true },
        fimCurso: { type: 'string', format: 'date-time', nullable: true },
        materias: {
            type: 'array',
            items: materia_1.schemaMateria,
            nullable: true,
        },
    },
    required: [],
    additionalProperties: true,
};
exports.ValidateCurso = ajv.compile(curso);
exports.ValidateAtualizacaoCurso = ajv.compile(atualizacaoCurso);
//# sourceMappingURL=curso.js.map