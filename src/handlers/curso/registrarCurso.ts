import {
  DatabaseService,
  withDatabaseTransaction,
} from '../../config/database';
import { Perfil, RegraPerfil } from '../../models';
import { ValidateCurso } from '../../schemas/curso';
import RepositorioProjeto from '../../services/repositories/RepositorioProjeto';
import Handler from '../../structure/handler';
import {
  getCurrentProfile,
  NavigationResult,
} from '../../structure/navigation';

export const RegistrarCursoHandler = new Handler(
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

    const idProjeto = context.params['idProjeto'] as string;
    const body = context.body;

    if (!ValidateCurso(body)) {
      return {
        status: 400,
        body: {
          error: JSON.stringify(ValidateCurso.errors),
        },
      };
    }

    const service: DatabaseService<NavigationResult<null>> = async (
      db,
      session
    ) => {
      const leituraProjeto = await RepositorioProjeto.readProjetoPorEmail(
        userProfile.email,
        db,
        session
      );
      if (!leituraProjeto.success) {
        return {
          status: 404,
          body: {
            error: 'PROJETO_NAO_ENCONTRADO',
          },
        };
      }

      if (idProjeto !== leituraProjeto.data.id) {
        return {
          status: 403,
          body: {
            error: 'NOT_AUTHORIZED',
          },
        };
      }

      const registro = await RepositorioProjeto.adicionarCurso(
        idProjeto,
        {
          ...(body as any),
          inicioCurso: new Date(body.inicioCurso),
          fimCurso: new Date(body.fimCurso),
        },
        db,
        session
      );

      if (!registro.success) {
        throw registro.error;
      }

      return {
        status: 200,
        body: null,
      };
    };

    return await withDatabaseTransaction(service);
  }
);
