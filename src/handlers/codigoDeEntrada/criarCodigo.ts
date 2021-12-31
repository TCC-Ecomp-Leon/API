import {
  DatabaseService,
  withDatabaseTransaction,
} from '../../config/database';
import {
  CodigoDeEntrada,
  Perfil,
  RegraPerfil,
  TipoCodigoDeEntrada,
} from '../../models';
import {
  InformacoesCodigoDeEntrada,
  ValidatorCriacaoCodigoDeEntrada,
} from '../../schemas/codigoEntrada';
import RepositorioCodigoDeEntrada from '../../services/repositories/RepositorioCodigoDeEntrada';
import RepositorioProjeto from '../../services/repositories/RepositorioProjeto';
import Context from '../../structure/context';
import Handler from '../../structure/handler';
import { NavigationResult } from '../../structure/navigation';

export const criarCodigoHandler = new Handler(
  async (
    context: Context
  ): Promise<NavigationResult<{ codigo: CodigoDeEntrada }>> => {
    const body = context.body as any;
    if (!ValidatorCriacaoCodigoDeEntrada(body)) {
      return {
        status: 400,
        body: {
          error: JSON.stringify(ValidatorCriacaoCodigoDeEntrada.errors),
        },
      };
    }

    const informacoesCodigo = body as InformacoesCodigoDeEntrada;

    const userProfile = context.getVariable<Perfil>('profile');

    if (userProfile.regra !== RegraPerfil.Projeto) {
      return {
        status: 403,
        body: {
          error: 'NOT_AUTHORIZED',
        },
      };
    }

    const service: DatabaseService<
      NavigationResult<{ codigo: CodigoDeEntrada }>
    > = async (db, session) => {
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

      if (!projeto.aprovado) {
        return {
          status: 403,
          body: {
            error: 'NOT_AUTHORIZED',
          },
        };
      }

      const curso = projeto.cursos.find(
        (curso) => curso.id === informacoesCodigo.idCurso
      );
      if (curso === undefined) {
        return {
          status: 404,
          body: {
            error: 'CURSO_NAO_ENCONTRADO',
          },
        };
      }

      if (informacoesCodigo.tipo === TipoCodigoDeEntrada.Professor) {
        const materia = curso.materias.find(
          (materia) => materia.id === informacoesCodigo.idMateria
        );
        if (materia === undefined) {
          return {
            status: 404,
            body: {
              error: 'MATERIA_NAO_ENCONTRADA',
            },
          };
        }
      }

      const result = await RepositorioCodigoDeEntrada.addCodigoDeEntrada(
        readProjeto.data.id,
        informacoesCodigo,
        db,
        session
      );

      if (!result.success) {
        throw result.error;
      }

      return {
        status: 200,
        body: {
          codigo: result.data,
        },
      };
    };

    return await withDatabaseTransaction(service);
  }
);
