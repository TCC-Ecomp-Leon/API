import { JSONSchemaType } from 'ajv';
import { Materia } from '../models';

export const schemaMateria: JSONSchemaType<Materia> = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    idCurso: { type: 'string' },
    nome: { type: 'string' },
    idPerfilProfessor: { type: 'string', nullable: true },
    descricao: { type: 'string' },
  },
  required: ['id', 'idCurso', 'nome', 'descricao'],
};
