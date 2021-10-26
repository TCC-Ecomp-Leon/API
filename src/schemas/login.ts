import Ajv, { JSONSchemaType } from 'ajv';
const ajv = new Ajv();

const loginSchema: JSONSchemaType<{ email: string; password: string }> = {
  type: 'object',
  properties: {
    email: { type: 'string' },
    password: { type: 'string' },
  },
  required: ['email', 'password'],
  additionalProperties: true,
};

export const LoginValidator = ajv.compile(loginSchema);
