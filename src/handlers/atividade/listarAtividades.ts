import {
  DatabaseService,
  withDatabaseTransaction,
} from '../../config/database';
import { Atividade, Perfil, RegraPerfil } from '../../models';
import RepositorioAtividade, {
  SituacaoAtividadeLeitura,
} from '../../services/repositories/RepositorioAtividade';
import RepositorioProjeto from '../../services/repositories/RepositorioProjeto';
import { DatabaseResult } from '../../structure/databaseResult';
import Handler from '../../structure/handler';
import {
  getCurrentProfile,
  NavigationResult,
} from '../../structure/navigation';

export const listarAtividadesHandler = new Handler(
  async (context): Promise<NavigationResult<{ atividades: Atividade[] }>> => {
    const userProfile = getCurrentProfile<Perfil>(context);

    const queryParamProjeto = context.query['projeto'];
    const queryParamMateria = context.query['materia'];
    const queryParamCurso = context.query['curso'];

    const queryParamAbertas = context.query['abertas'];

    let idProjeto: string | undefined = undefined;
    let idCurso: string | undefined = undefined;
    let idMateria: string | undefined = undefined;

    let lerAtividadesAbertas: SituacaoAtividadeLeitura =
      SituacaoAtividadeLeitura.todas;

    if (queryParamProjeto !== undefined) {
      idProjeto = queryParamProjeto as string;
    }
    if (queryParamCurso !== undefined) {
      idCurso = queryParamCurso as string;
    }
    if (queryParamMateria !== undefined) {
      idMateria = queryParamMateria as string;
    }
    if (queryParamAbertas !== undefined) {
      const param = queryParamAbertas as string;
      if (param === 'true') {
        lerAtividadesAbertas = SituacaoAtividadeLeitura.aberta;
      } else if (param === 'false') {
        lerAtividadesAbertas = SituacaoAtividadeLeitura.fechada;
      }
    }

    const service: DatabaseService<
      NavigationResult<{ atividades: Atividade[] }>
    > = async (db, session) => {
      let result: DatabaseResult<Atividade[]>;
      if (idMateria !== undefined) {
        result = await RepositorioAtividade.lerAtividadesEspecificas(
          'idMateria',
          idMateria,
          lerAtividadesAbertas,
          db,
          session
        );
      } else if (idCurso !== undefined) {
        result = await RepositorioAtividade.lerAtividadesEspecificas(
          'idCurso',
          idCurso,
          lerAtividadesAbertas,
          db,
          session
        );
      } else if (idProjeto !== undefined) {
        result = await RepositorioAtividade.lerAtividadesEspecificas(
          'idProjeto',
          idProjeto,
          lerAtividadesAbertas,
          db,
          session
        );
      } else {
        if (userProfile.regra === RegraPerfil.Projeto) {
          const leituraProjeto = await RepositorioProjeto.readProjetoPorEmail(
            userProfile.email,
            db,
            session
          );
          if (!leituraProjeto.success) {
            throw leituraProjeto.error;
          }

          idProjeto = leituraProjeto.data.id;
          result = await RepositorioAtividade.lerAtividadesEspecificas(
            'idProjeto',
            idProjeto,
            lerAtividadesAbertas,
            db,
            session
          );
        } else {
          result = await RepositorioAtividade.lerAtividades(
            lerAtividadesAbertas,
            db,
            session
          );
        }
      }

      if (!result.success) {
        throw result.error;
      }

      return {
        status: 200,
        body: {
          atividades: result.data,
        },
      };
    };

    return await withDatabaseTransaction(service);
  }
);
