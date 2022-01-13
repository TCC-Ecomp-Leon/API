import { signInHandler } from '../../handlers/auth/signInHandler';
import RepositorioPerfil from '../../services/repositories/RepositorioPerfil';
import Navigation, {
  NavigationResult,
  ProtectedNavigation,
} from '../../structure/navigation';
import { Perfil, Projeto, RegraPerfil } from '../../models';
import { ClientSession, Db } from 'mongodb';
import { DatabaseResult } from '../../structure/databaseResult';
import Handler from '../../structure/handler';
import Context from '../../structure/context';
import {
  DatabaseService,
  withDatabaseTransaction,
} from '../../config/database';
import RepositorioProjeto from '../../services/repositories/RepositorioProjeto';

export const getUserProfileNavigation = ProtectedNavigation([
  new Handler(
    async (
      context: Context
    ): Promise<
      NavigationResult<{
        profile: Perfil;
        projeto?: Projeto;
      }>
    > => {
      const perfil = context.getVariable('profile') as Perfil;
      if (perfil.regra === RegraPerfil.Projeto) {
        const service: DatabaseService<Projeto> = async (db, session) => {
          const readProjeto = await RepositorioProjeto.readProjetoPorEmail(
            perfil.email,
            db,
            session
          );

          if (!readProjeto.success) {
            throw readProjeto.error;
          }

          return readProjeto.data;
        };

        return {
          status: 200,
          body: {
            profile: perfil,
            projeto: await withDatabaseTransaction(service),
          },
        };
      }

      return {
        status: 200,
        body: {
          profile: perfil,
        },
      };
    }
  ),
]);
