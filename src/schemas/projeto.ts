import Ajv, { JSONSchemaType } from 'ajv';
import { InformacoesProjeto } from '../models';
import { Endereco } from '../models/Endereco';
import { schemaEndereco } from './endereco';

const ajv = new Ajv();

export type InformacoesRegistroProjeto = Omit<
  InformacoesProjeto,
  'id' | 'requisicaoEntradaEm'
>;
export type InformacoesAtualizacaoProjeto = Partial<
  Omit<InformacoesProjeto, 'id' | 'email' | 'requisicaoEntradaEm'>
>;

const registroProjeto: JSONSchemaType<InformacoesRegistroProjeto> = {
  type: 'object',
  properties: {
    nome: { type: 'string' },
    descricao: { type: 'string' },
    email: { type: 'string' },
    telefone: { type: 'integer' },
    imgProjeto: { type: 'string' },
    endereco: schemaEndereco,
  },
  required: [
    'nome',
    'descricao',
    'email',
    'telefone',
    'imgProjeto',
    'endereco',
  ],
  additionalProperties: true,
};

const informacoesProjeto: JSONSchemaType<InformacoesAtualizacaoProjeto> = {
  type: 'object',
  properties: {
    nome: { type: 'string', nullable: true },
    descricao: { type: 'string', nullable: true },
    telefone: { type: 'integer', nullable: true },
    endereco: { ...schemaEndereco, nullable: true },
    imgProjeto: { type: 'string', nullable: true },
  },
  required: [],
  additionalProperties: true,
};

export const RegistroProjetoValidator = ajv.compile(registroProjeto);
export const AtualizarProjetoValidator = ajv.compile(informacoesProjeto);
