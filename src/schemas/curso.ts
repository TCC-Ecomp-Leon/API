import Ajv, { JSONSchemaType } from 'ajv';
import { Curso } from '../models';
import { schemaMateria } from './materia';
import addFormats from 'ajv-formats';

const ajv = new Ajv({
  allowUnionTypes: true,
  timestamp: 'date',
});

addFormats(ajv);

const curso: JSONSchemaType<
  Omit<
    Curso & { inicioCurso: string } & { fimCurso: string },
    'id' | 'atualizadoEm' | 'idProjeto' | 'turma'
  >
> = {
  type: 'object',
  properties: {
    nome: { type: 'string' },
    descricao: { type: 'string', format: 'date' },
    inicioCurso: { type: 'string', format: 'date' },
    fimCurso: { type: 'string' },
    materias: {
      type: 'array',
      items: schemaMateria,
    },
  },
  required: ['nome', 'descricao', 'inicioCurso', 'fimCurso', 'materias'],
  additionalProperties: true,
};

const atualizacaoCurso: JSONSchemaType<
  Partial<
    Omit<
      Curso & { inicioCurso: string } & { fimCurso: string },
      'id' | 'atualizadoEm' | 'idProjeto' | 'turma'
    >
  >
> = {
  type: 'object',
  properties: {
    nome: { type: 'string', nullable: true },
    descricao: { type: 'string', format: 'date', nullable: true },
    inicioCurso: { type: 'string', format: 'date', nullable: true },
    fimCurso: { type: 'string', nullable: true },
    materias: {
      type: 'array',
      items: schemaMateria,
      nullable: true,
    },
  },
  required: [],
  additionalProperties: true,
};

export const ValidateCurso = ajv.compile(curso);
export const ValidateAtualizacaoCurso = ajv.compile(atualizacaoCurso);
