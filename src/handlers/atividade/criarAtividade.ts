import {
  DatabaseService,
  withDatabaseTransaction,
} from '../../config/database';
import { Perfil, RegraPerfil, TipoAtividade } from '../../models';
import {
  InformacoesAtividade,
  InformacoesAtividadeValidator,
} from '../../schemas/atividade';
import RepositorioAtividade from '../../services/repositories/RepositorioAtividade';
import RepositorioProjeto from '../../services/repositories/RepositorioProjeto';
import Handler from '../../structure/handler';
import {
  getCurrentProfile,
  NavigationResult,
} from '../../structure/navigation';
import { v4 as uuid } from 'uuid';
import { DatabaseResult } from '../../structure/databaseResult';

export const criarAtividadeHandler = new Handler(
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

    const body = context.body as any;

    if (!InformacoesAtividadeValidator(body)) {
      return {
        status: 400,
        body: {
          error: JSON.stringify(InformacoesAtividadeValidator.errors),
        },
      };
    }

    const informacoesAtividade = body as InformacoesAtividade;

    const service: DatabaseService<NavigationResult<null>> = async (
      db,
      session
    ) => {
      let result: DatabaseResult<string>;
      const { idCurso, idMateria, idProjeto } = informacoesAtividade;
      const leituraProjeto = await RepositorioProjeto.readProjetoPorEmail(
        userProfile.email,
        db,
        session
      );
      if (!leituraProjeto.success) {
        throw leituraProjeto.error;
      }
      const projeto = leituraProjeto.data;

      if (!projeto.aprovado || idProjeto !== projeto.id) {
        return {
          status: 403,
          body: {
            error: 'NOT_AUTHORIZED',
          },
        };
      }

      const pesquisaCursoMateria = projeto.cursos.find((curso) => {
        if (curso.id !== idCurso) return false;
        if (idMateria !== null) {
          const pesquisaMateria = curso.materias.find(
            (materia) => materia.id === idMateria
          );
          if (pesquisaMateria === undefined) return false;
        }

        return true;
      });
      if (pesquisaCursoMateria === undefined) {
        return {
          status: 400,
          body: {
            error: 'Matéria ou cursos inseridos incorretamente',
          },
        };
      }

      if (informacoesAtividade.tipo === TipoAtividade.Alternativa) {
        const {
          nome,
          aberturaRespostas,
          fechamentoRespostas,
          notaReferencia,
          questoes,
        } = informacoesAtividade;

        result = await RepositorioAtividade.addAtividadeAlternativa(
          nome,
          idProjeto,
          idCurso,
          idMateria,
          new Date(aberturaRespostas),
          new Date(fechamentoRespostas),
          notaReferencia,
          questoes.map((questao) => ({ ...questao, idQuestao: uuid() })),
          db,
          session
        );
      } else if (informacoesAtividade.tipo === TipoAtividade.BancoDeQuestoes) {
        const {
          nome,
          aberturaRespostas,
          fechamentoRespostas,
          assuntos,
          tempoColaboracao,
        } = informacoesAtividade;

        result = await RepositorioAtividade.addAtividadeBancoDeQuestoes(
          nome,
          idProjeto,
          idCurso,
          idMateria,
          new Date(aberturaRespostas),
          new Date(fechamentoRespostas),
          assuntos,
          tempoColaboracao,
          db,
          session
        );
      } else if (informacoesAtividade.tipo === TipoAtividade.Dissertativa) {
        const {
          nome,
          aberturaRespostas,
          fechamentoRespostas,
          fechamentoCorrecoes,
          notaReferencia,
          tempoColaboracao,
          questoes,
        } = informacoesAtividade;

        result = await RepositorioAtividade.addAtividadeDissertativa(
          nome,
          idProjeto,
          idCurso,
          idMateria,
          new Date(aberturaRespostas),
          new Date(fechamentoRespostas),
          new Date(fechamentoCorrecoes),
          notaReferencia,
          questoes.map((questao) => ({ ...questao, idQuestao: uuid() })),
          tempoColaboracao,
          db,
          session
        );
      } else {
        throw Error('Algo errado com o tipo de uma atividade');
      }
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
