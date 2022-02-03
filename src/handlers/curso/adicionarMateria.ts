import {
  DatabaseService,
  withDatabaseTransaction,
} from '../../config/database';
import { Perfil, RegraPerfil } from '../../models';
import { ValidateAtualizacaoCurso, ValidateMateria } from '../../schemas/curso';
import RepositorioProjeto from '../../services/repositories/RepositorioProjeto';
import Handler from '../../structure/handler';
import {
  getCurrentProfile,
  NavigationResult,
} from '../../structure/navigation';

export const adicionarMateriaHandler = new Handler(
  async (context): Promise<NavigationResult<null>> => {
    const idProjeto = context.params['idProjeto'] as string;
    const idCurso = context.params['idCurso'] as string;

    const userProfile = getCurrentProfile<Perfil>(context);

    if (userProfile.regra !== RegraPerfil.Projeto) {
      return {
        status: 403,
        body: {
          error: 'NOT_AUTHORIZED',
        },
      };
    }

    const body = context.body;

    if (!ValidateMateria(body)) {
      return {
        status: 400,
        body: {
          error: JSON.stringify(ValidateAtualizacaoCurso.errors),
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

      const projeto = leituraProjeto.data;

      if (idProjeto !== projeto.id) {
        return {
          status: 403,
          body: {
            error: 'NOT_AUTHORIZED',
          },
        };
      }

      if (!projeto.aprovado) {
        throw Error('Acesso indevido em projeto não aprovado');
      }

      if (projeto.cursos.find((curso) => curso.id === idCurso) === undefined) {
        return {
          status: 404,
          body: {
            error: 'CURSO_NAO_ENCONTRADO',
          },
        };
      }

      const result = await RepositorioProjeto.adicionarMateria(
        idProjeto,
        idCurso,
        {
          nome: body.nome,
          descricao: body.descricao,
        },
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
