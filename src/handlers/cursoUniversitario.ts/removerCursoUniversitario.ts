import {
  DatabaseService,
  withDatabaseTransaction,
} from '../../config/database';
import RepositorioCursoUniversitario from '../../services/repositories/RepositorioCursoUniversitario';
import Handler from '../../structure/handler';
import { NavigationResult } from '../../structure/navigation';

export const removerCursoUniversitarioHandler = new Handler(
  async (context): Promise<NavigationResult<null>> => {
    const idCursoUniversitario = context.params['id'] as string;

    const service: DatabaseService<NavigationResult<null>> = async (
      db,
      session
    ) => {
      const result =
        await RepositorioCursoUniversitario.deleteCursoUniversitario(
          idCursoUniversitario,
          db,
          session
        );
      if (!result.success) {
        return {
          status: 404,
          body: {
            error: 'CURSO_NAO_ENCONTRADO',
          },
        };
      }
      return {
        status: 200,
        body: null,
      };
    };

    return await withDatabaseTransaction(service);
  }
);
