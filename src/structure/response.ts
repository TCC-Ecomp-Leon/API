import { Express, Request, Response } from 'express';

export type OperationResult<T> =
  | {
      status: 200 | 201 | 202 | 203 | 204 | 205;
      body: T;
    }
  | {
      status: 400;
      body: {
        error: string;
      };
    }
  | {
      status: 401;
      body: {
        error:
          | 'INVALID_EMAIL_OR_PASSWORD'
          | 'REQUEST_WITHOUT_TOKEN'
          | 'INVALID_TOKEN';
      };
    }
  | {
      status: 403;
      body: {
        error: 'NOT_AUTHORIZED';
      };
    }
  | {
      status: 404;
      body: {
        error:
          | 'PROFILE_NOT_FOUND'
          | 'DATA_NOT_FOUND'
          | 'CURSO_NAO_ENCONTRADO'
          | 'MATERIA_NAO_ENCONTRADA'
          | 'PROJETO_NAO_ENCONTRADO';
      };
    }
  | {
      status: 406;
      body: {
        error: 'CANT_REGISTER_THAT_PROFILE' | 'PROJETO_JA_APROVADO';
      };
    }
  | {
      status: 409;
      body: {
        error: 'DATA_ALREADY_EXISTS';
      };
    }
  | null;
