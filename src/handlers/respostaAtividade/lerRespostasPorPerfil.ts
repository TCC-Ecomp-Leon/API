import {
  DatabaseService,
  withDatabaseTransaction,
} from '../../config/database';
import { RegraPerfil, RespostaAtividade } from '../../models';
import { readAuthProfile } from '../../services/authentification/firebaseAuth';
import RepositorioAtividade from '../../services/repositories/RepositorioAtividade';
import RepositorioPerfil from '../../services/repositories/RepositorioPerfil';
import RepositorioResposta from '../../services/repositories/RepositorioResposta';
import Handler from '../../structure/handler';
import { NavigationResult } from '../../structure/navigation';

export const lerRespostasPorPerfilHandler = new Handler(
  async (
    context
  ): Promise<NavigationResult<{ respostas: RespostaAtividade[] }>> => {
    const idPerfil = context.params['idPerfil'] as string;
    const idAtividade = context.params['idAtividade'] as string;

    const service: DatabaseService<
      NavigationResult<{ respostas: RespostaAtividade[] }>
    > = async (db, session) => {
      const authInfo = await readAuthProfile(idPerfil);
      if (!authInfo.success) {
        return {
          status: 404,
          body: {
            error: 'PROFILE_NOT_FOUND',
          },
        };
      }

      const leituraPerfil = await RepositorioPerfil.readPerfil(
        idPerfil,
        authInfo.data.email,
        true,
        db,
        session
      );
      if (!leituraPerfil.success) {
        return {
          status: 404,
          body: {
            error: 'PROFILE_NOT_FOUND',
          },
        };
      }

      const leituraAtividade = await RepositorioAtividade.lerAtividade(
        idAtividade,
        db,
        session
      );
      if (!leituraAtividade.success) {
        return {
          status: 404,
          body: {
            error: 'DATA_NOT_FOUND',
          },
        };
      }

      const perfil = leituraPerfil.data;
      const atividade = leituraAtividade.data;

      const idProjeto = atividade.idProjeto;
      const alunoProjeto =
        perfil.regra === RegraPerfil.Geral &&
        perfil.associacoes.aluno.alunoParceiro &&
        perfil.associacoes.aluno.cursos.filter(
          (curso) => curso.idProjeto === idProjeto
        ).length > 0;
      const universitario =
        !alunoProjeto &&
        perfil.regra === RegraPerfil.Geral &&
        perfil.universitario.universitario;

      if (alunoProjeto) {
        const leitura =
          await RepositorioResposta.lerRespostasDeUmAlunoEmUmaAtividade(
            idAtividade,
            idPerfil,
            db,
            session
          );
        if (!leitura.success) {
          throw leitura.error;
        }

        return {
          status: 200,
          body: {
            respostas: leitura.data,
          },
        };
      } else if (universitario) {
        const leitura =
          await RepositorioResposta.lerRespostasBancoDeQuestoesUniversitario(
            idPerfil,
            db,
            session
          );

        if (!leitura.success) {
          throw leitura.error;
        }

        return {
          status: 200,
          body: {
            respostas: leitura.data,
          },
        };
      }

      return {
        status: 200,
        body: {
          respostas: [],
        },
      };
    };

    return await withDatabaseTransaction(service);
  }
);
