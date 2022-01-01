import {
  DatabaseService,
  withDatabaseTransaction,
} from '../../config/database';
import { CursoUniversitario } from '../../models';
import { AtualizacaoCursoUniversitarioValidator } from '../../schemas/cursoUniversitario';
import RepositorioCursoUniversitario from '../../services/repositories/RepositorioCursoUniversitario';
import Handler from '../../structure/handler';
import { NavigationResult } from '../../structure/navigation';

export const atualizacaoCursoUniversitarioHandler = new Handler(
  async (context): Promise<NavigationResult<null>> => {
    const body = context.body;
    const idCursoUniversitario = context.params['id'] as string;

    if (!AtualizacaoCursoUniversitarioValidator(body)) {
      return {
        status: 400,
        body: {
          error: JSON.stringify(AtualizacaoCursoUniversitarioValidator.errors),
        },
      };
    }

    if (body.cursoAnterior?.id === idCursoUniversitario) {
      return {
        status: 400,
        body: {
          error: 'Um curso não pode ter como anterior ele mesmo',
        },
      };
    }

    const service: DatabaseService<NavigationResult<null>> = async (
      db,
      session
    ) => {
      const informacoes = body as Partial<
        Omit<CursoUniversitario, 'id' | 'cursoAnterior'> & {
          cursoAnterior: { id: string } | null;
        }
      >;

      let cursoUniversitario: Partial<CursoUniversitario>;

      if (informacoes.cursoAnterior !== undefined) {
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
      } else {
        cursoUniversitario = {
          ...informacoes,
          cursoAnterior: undefined,
        };
      }

      const leituraCurso =
        await RepositorioCursoUniversitario.readCursoUniversitario(
          idCursoUniversitario,
          db,
          session
        );
      if (!leituraCurso.success) {
        return {
          status: 404,
          body: {
            error: 'CURSO_NAO_ENCONTRADO',
          },
        };
      }

      const result =
        await RepositorioCursoUniversitario.updateCursoUniversitario(
          idCursoUniversitario,
          cursoUniversitario,
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
