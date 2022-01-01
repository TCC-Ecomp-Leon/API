import Ajv, { JSONSchemaType } from 'ajv';
import { CursoUniversitario } from '../models';

const ajv = new Ajv({
  allowUnionTypes: true,
  timestamp: 'date',
});

const cursoUniversitario: JSONSchemaType<
  Omit<CursoUniversitario, 'id' | 'cursoAnterior'> & {
    cursoAnterior: { id: string } | null;
  }
> = {
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

const atualizacaoCursoUniversitario: JSONSchemaType<
  Partial<
    Omit<CursoUniversitario, 'id' | 'cursoAnterior'> & {
      cursoAnterior: { id: string } | null;
    }
  >
> = {
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

export const CursoUniversitarioValidator = ajv.compile(cursoUniversitario);
export const AtualizacaoCursoUniversitarioValidator = ajv.compile(
  atualizacaoCursoUniversitario
);
