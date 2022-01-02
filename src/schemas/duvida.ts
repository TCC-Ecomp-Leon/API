import Ajv, { JSONSchemaType } from 'ajv';

const ajv = new Ajv({
  allowUnionTypes: true,
  timestamp: 'date',
});

export type InformacoesDuvida = {
  titulo: string;
  descricao: string;
  idCurso: string;
  idMateria: string | null;
  primeiraMensagem: string;
  idCursoUniversitario: string | null;
};

const informacoesDuvida: JSONSchemaType<InformacoesDuvida> = {
  type: 'object',
  properties: {
    titulo: { type: 'string' },
    descricao: { type: 'string' },
    idCurso: { type: 'string' },
    idMateria: { type: 'string', nullable: true },
    primeiraMensagem: { type: 'string' },
    idCursoUniversitario: { type: 'string', nullable: true },
  },
  required: [
    'titulo',
    'descricao',
    'idCurso',
    'idMateria',
    'primeiraMensagem',
    'idCursoUniversitario',
  ],
  additionalProperties: true,
};

const mensagemDuvida: JSONSchemaType<{ mensagem: string }> = {
  type: 'object',
  properties: {
    mensagem: { type: 'string' },
  },
  required: ['mensagem'],
  additionalProperties: true,
};

export const DuvidaValidator = ajv.compile(informacoesDuvida);
export const MensagemValidator = ajv.compile(mensagemDuvida);
