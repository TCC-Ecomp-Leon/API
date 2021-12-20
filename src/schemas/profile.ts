import Ajv, { JSONSchemaType } from 'ajv';
import { InformacoesPerfil } from '../models';
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

export const ProfileValidator = ajv.compile(profile);
