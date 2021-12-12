import Ajv, { JSONSchemaType } from 'ajv';
const ajv = new Ajv();

const codigoDeEntrada: JSONSchemaType<{
  codigoDeEntrada: string;
}> = {
  type: 'object',
  properties: {
    codigoDeEntrada: { type: 'string' },
  },
  required: ['codigoDeEntrada'],
  additionalProperties: true,
};

export const ValidatorCodigoDeEntrada = ajv.compile(codigoDeEntrada);
