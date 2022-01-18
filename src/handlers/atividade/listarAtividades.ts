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

    const idCurso = context.params['idCurso'] as string;

    const queryParamAbertas = context.query['abertas'];

    let lerAtividadesAbertas: SituacaoAtividadeLeitura =
      SituacaoAtividadeLeitura.todas;

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
      const aluno =
        userProfile.regra === RegraPerfil.Geral &&
        userProfile.associacoes.aluno.alunoParceiro &&
        userProfile.associacoes.aluno.cursos.filter(
          (curso) => curso.id == idCurso
        ).length > 0;
      const universitario =
        !aluno &&
        userProfile.regra === RegraPerfil.Geral &&
        userProfile.universitario.universitario;

      const result = await RepositorioAtividade.lerAtividadesEspecificas(
        'idCurso',
        idCurso,
        lerAtividadesAbertas,
        aluno,
        universitario,
        db,
        session
      );

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
