import Ajv, { JSONSchemaType } from 'ajv';
import { Curso, Materia } from '../models';
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
    descricao: { type: 'string' },
    inicioCurso: { type: 'string', format: 'date-time' },
    fimCurso: { type: 'string', format: 'date-time' },
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
    descricao: { type: 'string', nullable: true },
    inicioCurso: { type: 'string', format: 'date-time', nullable: true },
    fimCurso: { type: 'string', format: 'date-time', nullable: true },
    materias: {
      type: 'array',
      items: schemaMateria,
      nullable: true,
    },
  },
  required: [],
  additionalProperties: true,
};

const novaMateriaCurso: JSONSchemaType<
  Omit<Materia, 'id' | 'idPerfilProfessor' | 'idCurso'>
> = {
  type: 'object',
  properties: {
    nome: { type: 'string' },
    descricao: { type: 'string' },
  },
  required: ['nome', 'descricao'],
};

export const ValidateCurso = ajv.compile(curso);
export const ValidateAtualizacaoCurso = ajv.compile(atualizacaoCurso);
export const ValidateMateria = ajv.compile(novaMateriaCurso);
