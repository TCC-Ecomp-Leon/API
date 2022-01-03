import Ajv, { JSONSchemaType } from 'ajv';
import {
  BancoDeQuestoes,
  QuestaoBancoDeQuestoes,
  TipoAtividade,
} from '../models';
import {
  EstruturaRespostaAlternativa,
  EstruturaRespostaBancoDeQuestoes,
  EstruturaRespostaDissertativa,
} from '../services/repositories/RepositorioResposta';

const ajv = new Ajv({
  allowUnionTypes: true,
  timestamp: 'date',
});

export type InformacoesRespostaAlternativa = Omit<
  EstruturaRespostaAlternativa,
  'id' | 'idAtividade' | 'respondidoEm' | 'idAluno'
>;
export type InformacoesRespostaDissertativa = Omit<
  EstruturaRespostaDissertativa,
  'id' | 'idAtividade' | 'respondidoEm' | 'idAluno' | 'corrigida'
>;
export type InformacoesRespostaBancoDeQuestoes = Omit<
  EstruturaRespostaBancoDeQuestoes,
  | 'id'
  | 'idUniversitario'
  | 'avaliada'
  | 'idAtividade'
  | 'respondidoEm'
  | 'respostas'
> & { respostas: Omit<QuestaoBancoDeQuestoes, 'idAtividade'>[] };

const _informacoesRespostaAlternativa: JSONSchemaType<InformacoesRespostaAlternativa> =
  {
    type: 'object',
    properties: {
      tipo: { type: 'integer', const: TipoAtividade.Alternativa },
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

const _informacoesRespostaDissertativa: JSONSchemaType<InformacoesRespostaDissertativa> =
  {
    type: 'object',
    properties: {
      tipo: { type: 'integer', const: TipoAtividade.Dissertativa },
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

const _informacoesRespostaBancoDeQuestoes: JSONSchemaType<InformacoesRespostaBancoDeQuestoes> =
  {
    type: 'object',
    properties: {
      tipo: { type: 'integer', const: TipoAtividade.BancoDeQuestoes },
      respostas: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            idQuestao: { type: 'string' },
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
          required: ['idQuestao', 'enunciado', 'alternativas'],
        },
      },
    },
    required: ['tipo', 'respostas'],
    additionalProperties: true,
  };

export type InformacoesResposta =
  | InformacoesRespostaAlternativa
  | InformacoesRespostaDissertativa
  | InformacoesRespostaBancoDeQuestoes;

const informacoesResposta: JSONSchemaType<InformacoesResposta> = {
  oneOf: [
    _informacoesRespostaAlternativa,
    _informacoesRespostaDissertativa,
    _informacoesRespostaBancoDeQuestoes,
  ],
};

export const RespostaAtividadeValidator = ajv.compile(informacoesResposta);
