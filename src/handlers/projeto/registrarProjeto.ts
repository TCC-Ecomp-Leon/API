import {
  DatabaseService,
  withDatabaseTransaction,
} from '../../config/database';
import { Endereco } from '../../models';
import { RegistroProjetoValidator } from '../../schemas/projeto';
import RepositorioProjeto from '../../services/repositories/RepositorioProjeto';
import Context from '../../structure/context';
import Handler from '../../structure/handler';
import { NavigationResult } from '../../structure/navigation';

export const registrarProjetoHandler = new Handler(
  async (context: Context): Promise<NavigationResult<null>> => {
    const body = context.body;

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
      const informacoes = body as {
        nome: string;
        descricao: string;
        email: string;
        telefone: number;
        endereco: Endereco;
      };
      const result = await RepositorioProjeto.adicionarProjeto(
        informacoes.nome,
        informacoes.descricao,
        informacoes.email,
        informacoes.telefone,
        informacoes.endereco,
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
