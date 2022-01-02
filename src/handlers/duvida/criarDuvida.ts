import {
  DatabaseService,
  withDatabaseTransaction,
} from '../../config/database';
import { Duvida, Materia, Perfil, RegraPerfil } from '../../models';
import { DuvidaValidator, InformacoesDuvida } from '../../schemas/duvida';
import RepositorioCursoUniversitario from '../../services/repositories/RepositorioCursoUniversitario';
import RepositorioDuvida from '../../services/repositories/RepositorioDuvida';
import Handler from '../../structure/handler';
import {
  getCurrentProfile,
  NavigationResult,
} from '../../structure/navigation';

export const criarDuvidaHandler = new Handler(
  async (context): Promise<NavigationResult<null>> => {
    const userProfile = getCurrentProfile<Perfil>(context);

    const body = context.body as any;

    if (!DuvidaValidator(body)) {
      return {
        status: 400,
        body: {
          error: JSON.stringify(DuvidaValidator.errors),
        },
      };
    }

    const informacoes = body as InformacoesDuvida;

    const {
      titulo,
      descricao,
      idCurso,
      idMateria,
      primeiraMensagem,
      idCursoUniversitario,
    } = informacoes;

    if (
      userProfile.regra !== RegraPerfil.Geral ||
      !userProfile.associacoes.aluno.alunoParceiro
    ) {
      return {
        status: 403,
        body: {
          error: 'NOT_AUTHORIZED',
        },
      };
    }

    const cursosAluno = userProfile.associacoes.aluno.cursos;
    let materiasAluno: Materia[] = [];
    cursosAluno.forEach((curso) => {
      materiasAluno = [...materiasAluno, ...curso.materias];
    });

    if (
      cursosAluno.find((curso) => curso.id === idCurso) === undefined ||
      (idMateria !== null &&
        materiasAluno.find((materia) => materia.id === idMateria) === undefined)
    ) {
      return {
        status: 403,
        body: {
          error: 'NOT_AUTHORIZED',
        },
      };
    }

    const service: DatabaseService<NavigationResult<null>> = async (
      db,
      session
    ) => {
      if (idCursoUniversitario !== null) {
        const leituraCursoUniversitario =
          await RepositorioCursoUniversitario.readCursoUniversitario(
            idCursoUniversitario,
            db,
            session
          );
        if (!leituraCursoUniversitario.success) {
          return {
            status: 404,
            body: {
              error: 'CURSO_NAO_ENCONTRADO',
            },
          };
        }
      }
      const result = await RepositorioDuvida.adicionarDuvida(
        titulo,
        descricao,
        userProfile.id,
        idCurso,
        idMateria,
        primeiraMensagem,
        idCursoUniversitario,
        db,
        session
      );
      if (!result.success) {
        throw result.error;
      }

      return {
        status: 200,
        body: null,
      };
    };
    return await withDatabaseTransaction(service);
  }
);
