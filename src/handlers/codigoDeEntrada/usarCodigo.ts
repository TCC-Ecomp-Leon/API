import {
  DatabaseService,
  withDatabaseTransaction,
} from '../../config/database';
import { Perfil, RegraPerfil, TipoCodigoDeEntrada } from '../../models';
import RepositorioCodigoDeEntrada from '../../services/repositories/RepositorioCodigoDeEntrada';
import RepositorioProjeto from '../../services/repositories/RepositorioProjeto';
import Handler from '../../structure/handler';
import { NavigationResult } from '../../structure/navigation';

export const usarCodigoHandler = new Handler(
  async (context): Promise<NavigationResult<null>> => {
    const userProfile = context.getVariable<Perfil>('profile');

    if (userProfile.regra !== RegraPerfil.Geral) {
      return {
        status: 403,
        body: {
          error: 'NOT_AUTHORIZED',
        },
      };
    }

    const idCodigo = context.params['id'] as string;

    const service: DatabaseService<NavigationResult<null>> = async (
      db,
      session
    ) => {
      const readCodigo = await RepositorioCodigoDeEntrada.readCodigoDeEntrada(
        idCodigo,
        db,
        session
      );
      if (!readCodigo.success) {
        return {
          status: 404,
          body: {
            error: 'DATA_NOT_FOUND',
          },
        };
      }

      const codigo = readCodigo.data;

      if (codigo.usado) {
        return {
          status: 406,
          body: {
            error: 'CODIGO_JA_USADO',
          },
        };
      }

      if (codigo.tipo === TipoCodigoDeEntrada.Aluno) {
        const adicaoAlunoCurso = await RepositorioProjeto.adicionarAlunoAoCurso(
          codigo.idProjeto,
          codigo.idCurso,
          userProfile.id,
          db,
          session
        );
        if (!adicaoAlunoCurso.success) {
          throw adicaoAlunoCurso.error;
        }
      } else if (codigo.tipo === TipoCodigoDeEntrada.Professor) {
        const atribuicaoProfessor =
          await RepositorioProjeto.atribuirProfessorAMateria(
            codigo.idProjeto,
            codigo.idCurso,
            codigo.idMateria,
            userProfile.id,
            db,
            session
          );

        if (!atribuicaoProfessor.success) {
          throw atribuicaoProfessor.error;
        }
      } else {
        throw Error('Código de entrada com tipo errado');
      }

      const usarCodigo = await RepositorioCodigoDeEntrada.usarCodigoDeEntrada(
        idCodigo,
        userProfile.id,
        db,
        session
      );

      if (!usarCodigo.success) {
        throw usarCodigo.error;
      }

      return {
        status: 200,
        body: null,
      };
    };

    return await withDatabaseTransaction(service);
  }
);
