import { signInHandler } from '../../handlers/auth/signInHandler';
import RepositorioPerfil from '../../services/repositories/RepositorioPerfil';
import Navigation, {
  NavigationResult,
  ProtectedNavigation,
} from '../../structure/navigation';
import { Perfil } from '../../models';
import { ClientSession, Db } from 'mongodb';
import { DatabaseResult } from '../../structure/databaseResult';
import Handler from '../../structure/handler';
import Context from '../../structure/context';

const getProfile = async (
  userId: string,
  email: string,
  session: ClientSession,
  db: Db
): Promise<DatabaseResult<Perfil | null>> => {
  const profile = await RepositorioPerfil.readPerfil(
    userId,
    email,
    false,
    db,
    session
  );
  return profile;
};

export const tokenGetProfileNavigation = ProtectedNavigation(
  [
    new Handler(
      async (
        context: Context
      ): Promise<
        NavigationResult<{
          profile: Perfil;
        }>
      > => {
        const perfil = context.getVariable('profile') as Perfil;

        return {
          status: 200,
          body: {
            profile: perfil,
          },
        };
      }
    ),
  ],
  getProfile
);
