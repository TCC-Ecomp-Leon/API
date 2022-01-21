"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidatorCriacaoCodigoDeEntrada = exports.ValidatorUsoCodigoDeEntrada = void 0;
const ajv_1 = __importDefault(require("ajv"));
const models_1 = require("../models");
const ajv = new ajv_1.default({
    allowUnionTypes: true,
});
const userCodigoDeEntrada = {
    type: 'object',
    properties: {
        codigoDeEntrada: { type: 'string' },
    },
    required: ['codigoDeEntrada'],
    additionalProperties: true,
};
const informacoesCodigoDeEntrada = {
    oneOf: [
        {
            type: 'object',
            properties: {
                tipo: { type: 'integer', const: models_1.TipoCodigoDeEntrada.Professor },
                idCurso: { type: 'string' },
                idMateria: { type: 'string' },
            },
            required: ['idCurso', 'idMateria', 'tipo'],
            additionalProperties: true,
        },
        {
            type: 'object',
            properties: {
                tipo: { type: 'integer', const: models_1.TipoCodigoDeEntrada.Aluno },
                idCurso: { type: 'string' },
            },
            required: ['tipo', 'idCurso'],
            additionalProperties: true,
        },
    ],
};
exports.ValidatorUsoCodigoDeEntrada = ajv.compile(userCodigoDeEntrada);
exports.ValidatorCriacaoCodigoDeEntrada = ajv.compile(informacoesCodigoDeEntrada);
//# sourceMappingURL=codigoEntrada.js.map