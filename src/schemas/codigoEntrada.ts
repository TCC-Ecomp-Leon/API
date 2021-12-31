import Ajv, { JSONSchemaType } from 'ajv';
import { TipoCodigoDeEntrada } from '../models';

const ajv = new Ajv({
  allowUnionTypes: true,
});

const userCodigoDeEntrada: JSONSchemaType<{
  codigoDeEntrada: string;
}> = {
  type: 'object',
  properties: {
    codigoDeEntrada: { type: 'string' },
  },
  required: ['codigoDeEntrada'],
  additionalProperties: true,
};

export type InformacoesCodigoDeEntrada =
  | {
      tipo: TipoCodigoDeEntrada.Professor;
      idCurso: string;
      idMateria: string;
    }
  | { tipo: TipoCodigoDeEntrada.Aluno; idCurso: string };

const informacoesCodigoDeEntrada: JSONSchemaType<InformacoesCodigoDeEntrada> = {
  oneOf: [
    {
      type: 'object',
      properties: {
        tipo: { type: 'integer', const: TipoCodigoDeEntrada.Professor },
        idCurso: { type: 'string' },
        idMateria: { type: 'string' },
      },
      required: ['idCurso', 'idMateria', 'tipo'],
      additionalProperties: true,
    },
    {
      type: 'object',
      properties: {
        tipo: { type: 'integer', const: TipoCodigoDeEntrada.Aluno },
        idCurso: { type: 'string' },
      },
      required: ['tipo', 'idCurso'],
      additionalProperties: true,
    },
  ],
};

export const ValidatorUsoCodigoDeEntrada = ajv.compile(userCodigoDeEntrada);
export const ValidatorCriacaoCodigoDeEntrada = ajv.compile(
  informacoesCodigoDeEntrada
);
