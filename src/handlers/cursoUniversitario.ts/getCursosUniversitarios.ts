import {
  DatabaseService,
  withDatabaseTransaction,
} from '../../config/database';
import { CursoUniversitario } from '../../models';
import RepositorioCursoUniversitario from '../../services/repositories/RepositorioCursoUniversitario';
import Handler from '../../structure/handler';
import { NavigationResult } from '../../structure/navigation';

export const getCursosUniversitariosHandler = new Handler(
  async (
    context
  ): Promise<
    NavigationResult<{ cursosUniversitarios: CursoUniversitario[] }>
  > => {
    const service: DatabaseService<
      NavigationResult<{
        cursosUniversitarios: CursoUniversitario[];
      }>
    > = async (db, session) => {
      const leituraCursos =
        await RepositorioCursoUniversitario.readCursosUniversitarios(
          db,
          session
        );

      if (!leituraCursos.success) {
        throw leituraCursos.error;
      }

      return {
        status: 200,
        body: {
          cursosUniversitarios: leituraCursos.data,
        },
      };
    };

    return await withDatabaseTransaction(service);
  }
);
