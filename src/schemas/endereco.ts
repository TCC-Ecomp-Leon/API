import { JSONSchemaType } from 'ajv';
import { Endereco } from '../models';

export const schemaEndereco: JSONSchemaType<Endereco> = {
  type: 'object',
  properties: {
    rua: { type: 'string' },
    numero: { type: 'integer' },
    bairro: { type: 'string' },
    complemento: { type: 'string', nullable: true },
    cidade: { type: 'string' },
    estado: { type: 'string' },
    cep: { type: 'integer' },
    localizacao: {
      type: 'object',
      properties: {
        lat: { type: 'number' },
        lng: { type: 'number' },
      },
      required: ['lat', 'lng'],
    },
  },
  required: [
    'rua',
    'numero',
    'bairro',
    'cidade',
    'estado',
    'cep',
    'localizacao',
  ],
};
