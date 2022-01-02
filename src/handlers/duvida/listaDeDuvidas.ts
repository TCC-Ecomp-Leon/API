import {
  DatabaseService,
  withDatabaseTransaction,
} from '../../config/database';
import { Duvida, Perfil, RegraPerfil } from '../../models';
import RepositorioDuvida from '../../services/repositories/RepositorioDuvida';
import RepositorioProjeto from '../../services/repositories/RepositorioProjeto';
import Handler from '../../structure/handler';
import {
  getCurrentProfile,
  NavigationResult,
} from '../../structure/navigation';

export const listaDeDuvidasHandler = new Handler(
  async (context): Promise<NavigationResult<{ duvidas: Duvida[] }>> => {
    const userProfile = getCurrentProfile<Perfil>(context);

    let idProjeto: string | undefined = undefined;
    if (context.query['projeto'] !== undefined) {
      idProjeto = context.query['projeto'] as string;
    }
    const service: DatabaseService<NavigationResult<{ duvidas: Duvida[] }>> =
      async (db, session) => {
        if (userProfile.regra === RegraPerfil.Projeto) {
          const readProjeto = await RepositorioProjeto.readProjetoPorEmail(
            userProfile.email,
            db,
            session
          );
          if (!readProjeto.success) {
            throw readProjeto.error;
          }

          idProjeto = readProjeto.data.id;
        }

        if (idProjeto !== undefined) {
          const leituraProjeto = await RepositorioProjeto.readProjeto(
            idProjeto,
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
          if (!projeto.aprovado) {
            return {
              status: 200,
              body: {
                duvidas: [],
              },
            };
          }

          const duvidasCursos = await Promise.all(
            projeto.cursos.map(async (curso) => {
              return await RepositorioDuvida.readDuvidasEspecificas(
                'idCursoAluno',
                curso.id,
                db,
                session
              );
            })
          );

          let duvidas: Duvida[] = [];
          duvidasCursos.forEach((info) => {
            if (!info.success) {
              throw info.error;
            }

            duvidas = [...duvidas, ...info.data];
          });

          return {
            status: 200,
            body: {
              duvidas: duvidas,
            },
          };
        } else {
          const leitura = await RepositorioDuvida.readDuvidas(db, session);
          if (!leitura.success) throw leitura.error;

          return {
            status: 200,
            body: {
              duvidas: leitura.data,
            },
          };
        }
      };

    return await withDatabaseTransaction(service);
  }
);
