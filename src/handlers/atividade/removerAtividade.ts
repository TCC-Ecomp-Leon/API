import {
  DatabaseService,
  withDatabaseTransaction,
} from '../../config/database';
import { Perfil, RegraPerfil } from '../../models';
import RepositorioAtividade from '../../services/repositories/RepositorioAtividade';
import RepositorioProjeto from '../../services/repositories/RepositorioProjeto';
import Handler from '../../structure/handler';
import {
  getCurrentProfile,
  NavigationResult,
} from '../../structure/navigation';

export const removerAtividadeHandler = new Handler(
  async (context): Promise<NavigationResult<null>> => {
    const idAtividade = context.params['id'] as string;
    const userProfile = getCurrentProfile<Perfil>(context);

    if (
      userProfile.regra !== RegraPerfil.Administrador &&
      userProfile.regra !== RegraPerfil.Projeto
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
      const leituraAtividade = await RepositorioAtividade.lerAtividade(
        idAtividade,
        db,
        session
      );

      if (!leituraAtividade.success) {
        return {
          status: 404,
          body: {
            error: 'DATA_NOT_FOUND',
          },
        };
      }

      const atividade = leituraAtividade.data;

      if (userProfile.regra === RegraPerfil.Projeto) {
        const leituraProjeto = await RepositorioProjeto.readProjetoPorEmail(
          userProfile.email,
          db,
          session
        );

        if (!leituraProjeto.success) {
          throw leituraProjeto.error;
        }

        if (leituraProjeto.data.id !== atividade.idProjeto) {
          return {
            status: 403,
            body: {
              error: 'NOT_AUTHORIZED',
            },
          };
        }
      }

      const result = await RepositorioAtividade.removerAtividade(
        idAtividade,
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
