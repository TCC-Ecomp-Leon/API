"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InformacoesAvaliacaoBancoDeQuestaoValidator = exports.CorrecaoQuestoesDissertativasValidator = exports.RespostaAtividadeValidator = void 0;
const ajv_1 = __importDefault(require("ajv"));
const models_1 = require("../models");
const ajv = new ajv_1.default({
    allowUnionTypes: true,
    timestamp: 'date',
});
const _informacoesRespostaAlternativa = {
    type: 'object',
    properties: {
        tipo: { type: 'integer', const: models_1.TipoAtividade.Alternativa },
        respostas: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    idQuestao: { type: 'string' },
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
                required: ['idQuestao', 'alternativas'],
            },
        },
    },
    required: ['tipo', 'respostas'],
    additionalProperties: true,
};
const _informacoesRespostaDissertativa = {
    type: 'object',
    properties: {
        tipo: { type: 'integer', const: models_1.TipoAtividade.Dissertativa },
        respostas: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    idQuestao: { type: 'string' },
                    resposta: {
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
                required: ['idQuestao', 'resposta'],
            },
        },
    },
    required: ['tipo', 'respostas'],
    additionalProperties: true,
};
const _informacoesRespostaBancoDeQuestoes = {
    type: 'object',
    properties: {
        tipo: { type: 'integer', const: models_1.TipoAtividade.BancoDeQuestoes },
        respostas: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    enunciado: { type: 'string' },
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
                required: ['enunciado', 'alternativas'],
            },
        },
    },
    required: ['tipo', 'respostas'],
    additionalProperties: true,
};
const informacoesResposta = {
    oneOf: [
        _informacoesRespostaAlternativa,
        _informacoesRespostaDissertativa,
        _informacoesRespostaBancoDeQuestoes,
    ],
};
exports.RespostaAtividadeValidator = ajv.compile(informacoesResposta);
const correcaoQuestoesDissertativas = {
    type: 'array',
    items: {
        type: 'object',
        properties: {
            idQuestao: { type: 'string' },
            nota: { type: 'number' },
            status: { type: 'integer' },
            comentarios: { type: 'string' },
        },
        required: ['idQuestao', 'nota', 'status', 'comentarios'],
        additionalProperties: true,
    },
};
exports.CorrecaoQuestoesDissertativasValidator = ajv.compile(correcaoQuestoesDissertativas);
const informacoesAvaliacaoBancoDeQuestoes = {
    type: 'object',
    properties: {
        comentario: { type: 'string' },
        avaliacaoQuestoes: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    aprovada: { type: 'boolean' },
                    idQuestao: { type: 'string' },
                },
                required: ['aprovada', 'idQuestao'],
            },
        },
    },
    required: ['avaliacaoQuestoes', 'comentario'],
    additionalProperties: true,
};
exports.InformacoesAvaliacaoBancoDeQuestaoValidator = ajv.compile(informacoesAvaliacaoBancoDeQuestoes);
//# sourceMappingURL=respostaAtividade.js.map