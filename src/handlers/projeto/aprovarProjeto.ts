import {
  DatabaseService,
  withDatabaseTransaction,
} from '../../config/database';
import {
  createAuthAccount,
  deleteAccount,
  requestResetPassword,
} from '../../services/authentification/firebaseAuth';
import RepositorioProjeto from '../../services/repositories/RepositorioProjeto';
import Context from '../../structure/context';
import Handler from '../../structure/handler';
import { NavigationResult } from '../../structure/navigation';
import generator from 'generate-password';
import RepositorioPerfil from '../../services/repositories/RepositorioPerfil';

export const aprovarProjetoHandler = new Handler(
  async (context: Context): Promise<NavigationResult<null>> => {
    const idProjeto = context.params['id'] as string;

    const service: DatabaseService<NavigationResult<null>> = async (
      db,
      session
    ) => {
      const readProjeto = await RepositorioProjeto.readProjeto(
        idProjeto,
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
      if (projeto.aprovado) {
        return {
          status: 406,
          body: {
            error: 'PROJETO_JA_APROVADO',
          },
        };
      }

      const registerResult = await createAuthAccount(
        projeto.email,
        generator.generate({
          length: 10,
          numbers: true,
        })
      );
      if (!registerResult.success) {
        return {
          status: 406,
          body: {
            error: 'CANT_REGISTER_THAT_PROFILE',
          },
        };
      }

      const resultAprovarProjeto = await RepositorioPerfil.addPerfilProjeto(
        registerResult.data.userId,
        projeto.email,
        db,
        session
      );

      if (!resultAprovarProjeto.success) {
        await deleteAccount(registerResult.data.token);
        throw resultAprovarProjeto.error;
      }

      // TODO: Enviar um email com essa senha gerada
      const resetPassword = await requestResetPassword(projeto.email);
      if (!resetPassword.success) {
        throw resetPassword.error;
      }

      return {
        status: 200,
        body: null,
      };
    };

    return await withDatabaseTransaction(service);
  }
);
