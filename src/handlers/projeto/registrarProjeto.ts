import {
  DatabaseService,
  withDatabaseTransaction,
} from '../../config/database';
import { RegistroProjetoValidator } from '../../schemas/projeto';
import RepositorioProjeto from '../../services/repositories/RepositorioProjeto';
import Context from '../../structure/context';
import Handler from '../../structure/handler';
import { NavigationResult } from '../../structure/navigation';

export const registrarProjetoHandler = new Handler(
  async (context: Context): Promise<NavigationResult<null>> => {
    const body = context.body as object;

    if (!RegistroProjetoValidator(body)) {
      return {
        status: 400,
        body: {
          error: JSON.stringify(RegistroProjetoValidator.errors),
        },
      };
    }

    const service: DatabaseService<NavigationResult<null>> = async (
      db,
      session
    ) => {
      const result = await RepositorioProjeto.adicionarProjeto(
        body.nome,
        body.descricao,
        body.email,
        body.telefone,
        body.endereco,
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
