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

export const getUserProfileNavigation = ProtectedNavigation([
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
]);
