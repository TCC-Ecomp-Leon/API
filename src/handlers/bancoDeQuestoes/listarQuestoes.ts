import {
  DatabaseService,
  withDatabaseTransaction,
} from '../../config/database';
import { BancoDeQuestoes } from '../../models';
import { SearchType } from '../../services/data/Database';
import RepositorioBancoDeQuestoes from '../../services/repositories/RepositorioBancoDeQuestoes';
import Handler from '../../structure/handler';
import { NavigationResult } from '../../structure/navigation';

export const listarQuestoesBancoDeQuestoesHandler = new Handler(
  async (
    context
  ): Promise<NavigationResult<{ questoes: BancoDeQuestoes[] }>> => {
    const idProjeto = context.params['idProjeto'] as string;

    const queryParamCurso = context.query['curso'];
    const queryParamMateria = context.query['materia'];
    const queryParamAssuntos = context.query['assunto'];

    const campoIdProjeto: keyof BancoDeQuestoes = 'idProjeto';
    const filtros: SearchType<BancoDeQuestoes>[] = [
      { key: campoIdProjeto, value: idProjeto },
    ];
    if (queryParamCurso !== undefined) {
      const campoIdCurso: keyof BancoDeQuestoes = 'idCurso';

      filtros.push({ key: campoIdCurso, value: queryParamCurso as string });
    }
    if (queryParamMateria !== undefined) {
      const campoIdMateria: keyof BancoDeQuestoes = 'idMateria';

      filtros.push({ key: campoIdMateria, value: queryParamMateria as string });
    }
    if (queryParamAssuntos !== undefined) {
      const campoAssunto: keyof BancoDeQuestoes = 'assuntos';

      const listaAssuntos = queryParamAssuntos as string[];
      listaAssuntos.forEach((assunto) => {
        filtros.push({ key: campoAssunto, value: assunto });
      });
    }

    const service: DatabaseService<
      NavigationResult<{ questoes: BancoDeQuestoes[] }>
    > = async (db, session) => {
      const result = await RepositorioBancoDeQuestoes.lerQuestoesComFiltro(
        filtros,
        db,
        session
      );
      if (!result.success) {
        throw result.error;
      }

      return {
        status: 200,
        body: {
          questoes: result.data,
        },
      };
    };

    return await withDatabaseTransaction(service);
  }
);
