import {
  DatabaseService,
  withDatabaseTransaction,
} from '../../config/database';
import { CursoUniversitario, Perfil } from '../../models';
import { CursoUniversitarioValidator } from '../../schemas/cursoUniversitario';
import RepositorioCursoUniversitario from '../../services/repositories/RepositorioCursoUniversitario';
import Handler from '../../structure/handler';
import {
  getCurrentProfile,
  NavigationResult,
} from '../../structure/navigation';

export const adicaoCursoUniversitarioHandler = new Handler(
  async (
    context
  ): Promise<NavigationResult<{ cursoUniversitario: CursoUniversitario }>> => {
    const body = context.body;

    if (!CursoUniversitarioValidator(body)) {
      return {
        status: 400,
        body: {
          error: JSON.stringify(CursoUniversitarioValidator.errors),
        },
      };
    }

    const informacoes = body as Omit<
      CursoUniversitario,
      'id' | 'cursoAnterior'
    > & {
      cursoAnterior: { id: string } | null;
    };

    let cursoUniversitario: Omit<CursoUniversitario, 'id'>;

    const service: DatabaseService<
      NavigationResult<{ cursoUniversitario: CursoUniversitario }>
    > = async (db, session) => {
      if (informacoes.cursoAnterior !== null) {
        const idCursoAnterior = informacoes.cursoAnterior.id;
        const leituraCursoNecessario =
          await RepositorioCursoUniversitario.readCursoUniversitario(
            idCursoAnterior,
            db,
            session
          );
        if (!leituraCursoNecessario.success) {
          return {
            status: 404,
            body: {
              error: 'DATA_NOT_FOUND',
            },
          };
        }
        cursoUniversitario = {
          ...informacoes,
          cursoAnterior: leituraCursoNecessario.data,
        };
      } else {
        cursoUniversitario = {
          ...informacoes,
          cursoAnterior: null,
        };
      }

      const addCursoUniversitario =
        await RepositorioCursoUniversitario.addCursoUniversitario(
          cursoUniversitario,
          db,
          session
        );

      if (!addCursoUniversitario.success) {
        throw addCursoUniversitario.error;
      }

      return {
        status: 200,
        body: {
          cursoUniversitario: addCursoUniversitario.data,
        },
      };
    };

    return await withDatabaseTransaction(service);
  }
);
