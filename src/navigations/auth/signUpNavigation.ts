import { Perfil, RegraPerfil, InformacoesPerfil } from '../../models';
import { signUpHandler } from '../../handlers/auth/signUpHandler';
import { ProfileValidator } from '../../schemas/profile';
import Navigation, { NavigationResult } from '../../structure/navigation';
import images from '../../assets/images';
import {
  DatabaseService,
  withDatabaseTransaction,
} from '../../config/database';
import { ValidatorUsoCodigoDeEntrada } from '../../schemas/codigoEntrada';
import RepositorioCodigoDeEntrada from '../../services/repositories/RepositorioCodigoDeEntrada';
import RepositorioPerfil from '../../services/repositories/RepositorioPerfil';
import RepositorioUniversitario from '../../services/repositories/RepositorioUniversitario';

export const signUpNavigation = new Navigation([
  signUpHandler<{
    email: string;
    nome: string;
    telefone: number;
    cpf: string;
  }>(
    [ProfileValidator],
    [
      {
        activationFunction: (body) => {
          const codigoDeEntrada = body['codigoDeEntrada'];
          return codigoDeEntrada !== undefined;
        },
        validator: ValidatorUsoCodigoDeEntrada,
      },
    ],
    (body) => {
      return {
        email: body.email,
        nome: body.nome,
        cpf: body.cpf,
        telefone: body.telefone,
      };
    },
    async (userId, profile, context, db, session) => {
      const _codigoDeEntrada = context.body['codigoDeEntrada'];
      const codigoDeEntrada: string | undefined =
        _codigoDeEntrada !== undefined && _codigoDeEntrada !== null
          ? (_codigoDeEntrada as string)
          : undefined;
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
        success: true,
        data: null,
      };
    }
  ),
]);
