import {
  DatabaseService,
  withDatabaseTransaction,
} from '../../config/database';
import { Perfil, RegraPerfil } from '../../models';
import RepositorioBancoDeQuestoes from '../../services/repositories/RepositorioBancoDeQuestoes';
import RepositorioProjeto from '../../services/repositories/RepositorioProjeto';
import Handler from '../../structure/handler';
import {
  getCurrentProfile,
  NavigationResult,
} from '../../structure/navigation';

export const removerQuestaoBancoDeQuestoesHandler = new Handler(
  async (context): Promise<NavigationResult<null>> => {
    const userProfile = getCurrentProfile<Perfil>(context);
    if (userProfile.regra !== RegraPerfil.Projeto) {
      return {
        status: 403,
        body: {
          error: 'NOT_AUTHORIZED',
        },
      };
    }
    const idQuestao = context.params['idQuestao'] as string;

    const service: DatabaseService<NavigationResult<null>> = async (
      db,
      session
    ) => {
      const leituraQuestao = await RepositorioBancoDeQuestoes.lerQuestao(
        idQuestao,
        db,
        session
      );
      if (!leituraQuestao.success) {
        return {
          status: 404,
          body: {
            error: 'DATA_NOT_FOUND',
          },
        };
      }
      const questao = leituraQuestao.data;

      const leituraProjeto = await RepositorioProjeto.readProjetoPorEmail(
        userProfile.email,
        db,
        session
      );
      if (!leituraProjeto.success) {
        throw leituraProjeto.error;
      }

      const projeto = leituraProjeto.data;
      if (questao.idProjeto !== projeto.id) {
        return {
          status: 403,
          body: { error: 'NOT_AUTHORIZED' },
        };
      }

      const result = await RepositorioBancoDeQuestoes.removerQuestao(
        idQuestao,
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
