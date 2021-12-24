import Ajv, { JSONSchemaType } from 'ajv';
import {
  CursoUniversitario,
  InformacoesPerfil,
  InformacoesUniversitario,
  InformacoesUniversitarioAprovado,
  RegraPerfil,
} from '../models';
const ajv = new Ajv();

const profile: JSONSchemaType<{
  email: string;
  nome: string;
  telefone: number;
  cpf: string;
}> = {
  type: 'object',
  properties: {
    email: { type: 'string' },
    nome: { type: 'string' },
    telefone: { type: 'integer' },
    cpf: { type: 'string' },
  },
  required: ['email', 'nome', 'telefone', 'cpf'],
  additionalProperties: true,
};

const updateProfile: JSONSchemaType<
  Partial<Omit<InformacoesPerfil, 'id' | 'entradaEm'>> & {
    regra: RegraPerfil;
  } & { cpf?: string }
> = {
  type: 'object',
  properties: {
    email: { type: 'string', nullable: true },
    nome: { type: 'string', nullable: true },
    telefone: { type: 'integer', nullable: true },
    fotoPerfil: { type: 'string', nullable: true },
    cpf: { type: 'string', nullable: true },
    regra: { type: 'integer' },
  },
  required: ['regra'],
  additionalProperties: true,
};

const informacoesUniversitario: JSONSchemaType<{
  curso: { id: string };
}> = {
  type: 'object',
  properties: {
    curso: {
      type: 'object',
      properties: {
        id: { type: 'string' },
      },
      required: ['id'],
      additionalProperties: true,
    },
  },
  required: [],
  additionalProperties: true,
};

export const ProfileValidator = ajv.compile(profile);
export const UpdateProfileValidator = ajv.compile(updateProfile);
export const UpdateInformacoesCursoUniversitario = ajv.compile(
  informacoesUniversitario
);
