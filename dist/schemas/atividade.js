"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InformacoesAtividadeValidator = void 0;
const ajv_1 = __importDefault(require("ajv"));
const models_1 = require("../models");
const ajv_formats_1 = __importDefault(require("ajv-formats"));
const ajv = new ajv_1.default({
    allowUnionTypes: true,
    timestamp: 'date',
    strict: false,
    strictTypes: false,
});
ajv_formats_1.default(ajv);
const informacoesAtividade = {
    oneOf: [
        {
            type: 'object',
            properties: {
                tipo: { type: 'integer', const: models_1.TipoAtividade.Alternativa },
                nome: { type: 'string' },
                idProjeto: { type: 'string' },
                idCurso: { type: 'string' },
                idMateria: { type: 'string', nullable: true },
                aberturaRespostas: { type: 'string', format: 'date-time' },
                fechamentoRespostas: { type: 'string', format: 'date-time' },
                notaReferencia: { type: 'number' },
                questoes: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            enunciado: { type: 'string' },
                            peso: { type: 'number' },
                            alternativas: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        item: { type: 'string' },
                                        value: { type: 'boolean' },
                                    },
                                    required: ['item', 'value'],
                                },
                            },
                        },
                        required: ['enunciado', 'peso', 'alternativas'],
                    },
                },
            },
            required: [
                'tipo',
                'nome',
                'idProjeto',
                'idCurso',
                'idMateria',
                'aberturaRespostas',
                'fechamentoRespostas',
                'notaReferencia',
                'questoes',
            ],
            additionalProperties: true,
        },
        {
            type: 'object',
            properties: {
                tipo: { type: 'integer', const: models_1.TipoAtividade.Dissertativa },
                nome: { type: 'string' },
                idProjeto: { type: 'string' },
                idCurso: { type: 'string' },
                idMateria: { type: 'string', nullable: true },
                aberturaRespostas: { type: 'string', format: 'date-time' },
                fechamentoRespostas: { type: 'string', format: 'date-time' },
                fechamentoCorrecoes: { type: 'string', format: 'date-time' },
                notaReferencia: { type: 'number' },
                tempoColaboracao: { type: 'number' },
                questoes: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            enunciado: { type: 'string' },
                            peso: { type: 'number' },
                            respostaEsperada: {
                                oneOf: [
                                    {
                                        type: 'object',
                                        properties: {
                                            foto: { type: 'boolean', const: false },
                                            texto: { type: 'string' },
                                        },
                                        required: ['foto', 'texto'],
                                    },
                                    {
                                        type: 'object',
                                        properties: {
                                            foto: { type: 'boolean', const: true },
                                            imagem: { type: 'string' },
                                        },
                                        required: ['foto', 'imagem'],
                                    },
                                ],
                            },
                        },
                        required: ['enunciado', 'peso', 'respostaEsperada'],
                    },
                },
            },
            required: [
                'tipo',
                'nome',
                'idProjeto',
                'idCurso',
                'idMateria',
                'aberturaRespostas',
                'fechamentoRespostas',
                'fechamentoCorrecoes',
                'notaReferencia',
                'tempoColaboracao',
                'questoes',
            ],
            additionalProperties: true,
        },
        {
            type: 'object',
            properties: {
                tipo: { type: 'integer', const: models_1.TipoAtividade.BancoDeQuestoes },
                nome: { type: 'string' },
                idProjeto: { type: 'string' },
                idCurso: { type: 'string' },
                idMateria: { type: 'string', nullable: true },
                aberturaRespostas: { type: 'string', format: 'date-time' },
                fechamentoRespostas: { type: 'string', format: 'date-time' },
                assuntos: {
                    type: 'array',
                    items: {
                        type: 'string',
                    },
                },
                tempoColaboracao: { type: 'number' },
            },
            required: [
                'tipo',
                'nome',
                'idProjeto',
                'idCurso',
                'idMateria',
                'aberturaRespostas',
                'fechamentoRespostas',
                'assuntos',
                'tempoColaboracao',
            ],
            additionalProperties: true,
        },
    ],
};
exports.InformacoesAtividadeValidator = ajv.compile(informacoesAtividade);
//# sourceMappingURL=atividade.js.map