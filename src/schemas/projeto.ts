import Ajv, { JSONSchemaType } from 'ajv';
import { InformacoesProjeto } from '../models';
import { Endereco } from '../models/Endereco';
import { schemaEndereco } from './endereco';

const ajv = new Ajv();

const registroProjeto: JSONSchemaType<{
  nome: string;
  descricao: string;
  email: string;
  telefone: number;
  endereco: Endereco;
}> = {
  type: 'object',
  properties: {
    nome: { type: 'string' },
    descricao: { type: 'string' },
    email: { type: 'string' },
    telefone: { type: 'integer' },
    endereco: schemaEndereco,
  },
  required: ['nome', 'descricao', 'email', 'telefone', 'endereco'],
  additionalProperties: true,
};

const informacoesProjeto: JSONSchemaType<
  Partial<Omit<InformacoesProjeto, 'id' | 'email' | 'requisicaoEntradaEm'>>
> = {
  type: 'object',
  properties: {
    nome: { type: 'string', nullable: true },
    descricao: { type: 'string', nullable: true },
    telefone: { type: 'integer', nullable: true },
    endereco: { ...schemaEndereco, nullable: true },
  },
  required: [],
  additionalProperties: true,
};

export const RegistroProjetoValidator = ajv.compile(registroProjeto);
export const AtualizarProjetoValidator = ajv.compile(informacoesProjeto);
