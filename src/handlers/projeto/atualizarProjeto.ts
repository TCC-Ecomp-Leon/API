import {
  DatabaseService,
  withDatabaseTransaction,
} from '../../config/database';
import { Perfil, RegraPerfil } from '../../models';
import {
  AtualizarProjetoValidator,
  InformacoesAtualizacaoProjeto,
} from '../../schemas/projeto';
import RepositorioProjeto from '../../services/repositories/RepositorioProjeto';
import Handler from '../../structure/handler';
import {
  getCurrentProfile,
  NavigationResult,
} from '../../structure/navigation';

export const atualizarProjetoHandler = new Handler(
  async (context): Promise<NavigationResult<null>> => {
    const idProjeto = context.params['id'] as string;
    const body = context.body as object;

    const userProfile = getCurrentProfile<Perfil>(context);
    if (userProfile.regra === RegraPerfil.Geral) {
      return {
        status: 403,
        body: {
          error: 'NOT_AUTHORIZED',
        },
      };
    }

    if (!AtualizarProjetoValidator(body)) {
      return {
        status: 400,
        body: {
          error: JSON.stringify(AtualizarProjetoValidator.errors),
        },
      };
    }

    const informacoes = body as InformacoesAtualizacaoProjeto;

    const service: DatabaseService<NavigationResult<null>> = async (
      db,
      session
    ) => {
      if (userProfile.regra === RegraPerfil.Projeto) {
        const readProjeto = await RepositorioProjeto.readProjetoPorEmail(
          userProfile.email,
          db,
          session
        );
        if (!readProjeto.success) {
          return {
            status: 404,
            body: {
              error: 'PROJETO_NAO_ENCONTRADO',
            },
          };
        }

        const projeto = readProjeto.data;

        if (projeto.email !== userProfile.email) {
          return {
            status: 403,
            body: {
              error: 'NOT_AUTHORIZED',
            },
          };
        }
      }

      const atualizacaoProjeto = await RepositorioProjeto.atualizarProjeto(
        idProjeto,
        informacoes,
        db,
        session
      );
      if (!atualizacaoProjeto.success) {
        throw atualizacaoProjeto.error;
      }

      return {
        status: 200,
        body: null,
      };
    };

    return await withDatabaseTransaction(service);
  }
);
