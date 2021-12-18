import { Curso } from './Curso';
import { Materia } from './Materia';

export enum TipoCodigoDeEntrada {
  Professor,
  Aluno,
}

type InformacoesCodigoDeEntrada = {
  id: string;
  idProjeto: string;
  geradoEm: Date;
} & (
  | {
      usado: false;
    }
  | {
      usado: true;
      usadoEm: Date;
      idPerfilUsou: string;
    }
);

export type CodigoDeEntrada = InformacoesCodigoDeEntrada &
  (
    | {
        tipo: TipoCodigoDeEntrada.Professor;
        idCurso: string;
        idMateria: string;
      }
    | {
        tipo: TipoCodigoDeEntrada.Aluno;
        idCurso: string;
      }
  );
