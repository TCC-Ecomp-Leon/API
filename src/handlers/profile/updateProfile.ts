import {
  DatabaseService,
  withDatabaseTransaction,
} from '../../config/database';
import { InformacoesPerfil, Perfil, RegraPerfil } from '../../models';
import RepositorioCursoUniversitario from '../../services/repositories/RepositorioCursoUniversitario';
import RepositorioPerfil from '../../services/repositories/RepositorioPerfil';
import RepositorioUniversitario from '../../services/repositories/RepositorioUniversitario';
import Context from '../../structure/context';
import Handler from '../../structure/handler';
import { NavigationResult } from '../../structure/navigation';

export const updateProfileHandler = new Handler(
  async (context: Context): Promise<NavigationResult<null>> => {
    const userProfile = context.getVariable<Perfil>('profile');

    const service: DatabaseService<NavigationResult<null>> = async (
      db,
      session
    ) => {
      const updatingProfile = context.getVariable('updatingProfile') as any;
      if (userProfile.regra !== RegraPerfil.Geral) {
        delete updatingProfile.cpf;
      }
      if (updatingProfile.email !== undefined) {
        delete updatingProfile.email;
      }
      if (updatingProfile.entradaEm !== undefined) {
        delete updatingProfile.entradaEm;
      }

      const result = await RepositorioPerfil.atualizarPerfil(
        userProfile.id,
        updatingProfile,
        db,
        session
      );

      const updatingCursoUniversitario = context.getVariable(
        'updatingCursoUniversitario'
      );

      if (
        updatingCursoUniversitario !== undefined &&
        userProfile.regra === RegraPerfil.Geral &&
        userProfile.universitario.universitario
      ) {
        const idCursoUniversitario = (updatingCursoUniversitario as any).curso
          .id;

        const readCurso =
          await RepositorioCursoUniversitario.readCursoUniversitario(
            idCursoUniversitario,
            db,
            session
          );
        if (!readCurso.success) {
          throw readCurso.error;
        }

        const updateCursoResult = await RepositorioUniversitario.atualizarCurso(
          userProfile.email,
          readCurso.data,
          db,
          session
        );
        if (!updateCursoResult.success) {
          throw updateCursoResult.error;
        }
      }

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
