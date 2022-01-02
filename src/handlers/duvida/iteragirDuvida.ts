import {
  DatabaseService,
  withDatabaseTransaction,
} from '../../config/database';
import { Perfil, RegraPerfil } from '../../models';
import { MensagemValidator } from '../../schemas/duvida';
import RepositorioDuvida from '../../services/repositories/RepositorioDuvida';
import Handler from '../../structure/handler';
import {
  getCurrentProfile,
  NavigationResult,
} from '../../structure/navigation';

export const iteragirDuvidaHandler = new Handler(
  async (context): Promise<NavigationResult<null>> => {
    const userProfile = getCurrentProfile<Perfil>(context);
    const idDuvida = context.params['id'] as string;

    const parametroFechar = context.query['fechar'] as string;
    let fecharDuvida: boolean = false;
    if (parametroFechar === 'true') {
      fecharDuvida = true;
    }

    const service: DatabaseService<NavigationResult<null>> = async (
      db,
      session
    ) => {
      const leituraDuvida = await RepositorioDuvida.readDuvida(
        idDuvida,
        db,
        session
      );
      if (!leituraDuvida.success) {
        return {
          status: 404,
          body: {
            error: 'DATA_NOT_FOUND',
          },
        };
      }

      if (!fecharDuvida) {
        const body = context.body as any;
        if (!MensagemValidator(body)) {
          return {
            status: 400,
            body: {
              error: JSON.stringify(MensagemValidator.errors),
            },
          };
        }

        const cast = body as { mensagem: string };

        const result = await RepositorioDuvida.adicionarMensagem(
          idDuvida,
          userProfile.id,
          cast.mensagem,
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
      } else {
        const duvida = leituraDuvida.data;

        if (
          userProfile.regra === RegraPerfil.Geral &&
          duvida.idAluno !== userProfile.id
        ) {
          return {
            status: 403,
            body: {
              error: 'NOT_AUTHORIZED',
            },
          };
        }

        const result = await RepositorioDuvida.fecharDuvida(
          idDuvida,
          userProfile.id,
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
      }
    };
    return await withDatabaseTransaction(service);
  }
);
