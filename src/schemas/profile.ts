import Ajv, { JSONSchemaType } from 'ajv';
const ajv = new Ajv();

const profile: JSONSchemaType<{}> = {
  type: 'object',
  additionalProperties: true,
};

export const ProfileValidator = ajv.compile(profile);
