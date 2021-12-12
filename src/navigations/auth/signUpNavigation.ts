import { Perfil, RegraPerfil, InformacoesPerfil } from 'tcc-models';
import { signUpHandler } from '../../handlers/auth/signUpHandler';
import { ProfileValidator } from '../../schemas/profile';
import Navigation, { NavigationResult } from '../../structure/navigation';
import images from '../../../assets/images';
import {
  DatabaseService,
  withDatabaseTransaction,
} from '../../config/database';
import { ValidatorCodigoDeEntrada } from '../../schemas/codigoEntrada';
import RepositorioCodigoDeEntrada from '../../services/repositories/RepositorioCodigoDeEntrada';
import RepositorioPerfil from '../../services/repositories/RepositorioPerfil';

export const signUpNavigation = new Navigation([
  signUpHandler<{
    email: string;
    nome: string;
    telefone: number;
    cpf: string;
  }>(
    [ProfileValidator, ValidatorCodigoDeEntrada],
    async (userId, profile, context, db, session) => {
      const service: DatabaseService<NavigationResult<null>> = async (
        db,
        session
      ) => {
        const codigoDeEntrada = context.body['codigoDeEntrada'] as string;
        const adicionarPerfil = await RepositorioPerfil.addPerfilGeral(
          userId,
          profile.email,
          profile.nome,
          profile.telefone,
          codigoDeEntrada,
          db,
          session
        );
        if (!adicionarPerfil.success) {
          throw adicionarPerfil.error;
        }
        return {
          status: 204,
          body: null,
        };
      };

      await withDatabaseTransaction(service);

      return { success: true, data: null };
    }
  ),
]);
