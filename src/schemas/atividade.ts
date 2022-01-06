import Ajv, { JSONSchemaType } from 'ajv';
import { TipoAtividade } from '../models';
import addFormats from 'ajv-formats';

const ajv = new Ajv({
  allowUnionTypes: true,
  timestamp: 'date',
  strict: false,
  strictTypes: false,
});

addFormats(ajv);

type InformacoesAtividadeAlternativa = {
  nome: string;
  idProjeto: string;
  idCurso: string;
  idMateria: string | null;
  aberturaRespostas: string;
  fechamentoRespostas: string;
  notaReferencia: number;
  questoes: {
    enunciado: string;
    peso: number;
    alternativas: { item: string; value: boolean }[];
  }[];
};

type InformacoesAtividadeDissertativa = {
  nome: string;
  idProjeto: string;
  idCurso: string;
  idMateria: string | null;
  aberturaRespostas: string;
  fechamentoRespostas: string;
  fechamentoCorrecoes: string;
  notaReferencia: number;
  questoes: {
    enunciado: string;
    peso: number;
    respostaEsperada:
      | {
          foto: false;
          texto: string;
        }
      | {
          foto: true;
          imagem: string;
        };
  }[];
  tempoColaboracao: number;
};

type InformacoesAtividadeBancoDeQuestoes = {
  nome: string;
  idProjeto: string;
  idCurso: string;
  idMateria: string | null;
  aberturaRespostas: string;
  fechamentoRespostas: string;
  assuntos: string[];
  tempoColaboracao: number;
};

export type InformacoesAtividade =
  | (InformacoesAtividadeAlternativa & { tipo: TipoAtividade.Alternativa })
  | (InformacoesAtividadeDissertativa & { tipo: TipoAtividade.Dissertativa })
  | (InformacoesAtividadeBancoDeQuestoes & {
      tipo: TipoAtividade.BancoDeQuestoes;
    });

const informacoesAtividade: JSONSchemaType<InformacoesAtividade> = {
  oneOf: [
    {
      type: 'object',
      properties: {
        tipo: { type: 'integer', const: TipoAtividade.Alternativa },
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
        tipo: { type: 'integer', const: TipoAtividade.Dissertativa },
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
        tipo: { type: 'integer', const: TipoAtividade.BancoDeQuestoes },
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

export const InformacoesAtividadeValidator = ajv.compile(informacoesAtividade);
