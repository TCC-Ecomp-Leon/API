import { signInHandler } from '../../handlers/auth/signInHandler';
import { Perfil, Projeto, RegraPerfil } from '../../models';
import RepositorioPerfil from '../../services/repositories/RepositorioPerfil';
import RepositorioProjeto from '../../services/repositories/RepositorioProjeto';
import Navigation from '../../structure/navigation';

export const signInNavigation = new Navigation([
  signInHandler<{
    profile: Perfil;
    projeto?: Projeto;
  }>(async (userId, email, emailVerificado, db, session) => {
    const profile = await RepositorioPerfil.readPerfil(
      userId,
      email,
      emailVerificado,
      db,
      session
    );
    if (!profile.success) {
      throw profile.error;
    }

    if (profile.data.regra === RegraPerfil.Projeto) {
      const readProjeto = await RepositorioProjeto.readProjetoPorEmail(
        profile.data.email,
        db,
        session
      );
      if (!readProjeto.success) {
        throw readProjeto.error;
      }

      return {
        success: true,
        data: {
          profile: profile.data,
          projeto: readProjeto.data,
        },
      };
    }

    return {
      success: true,
      data: {
        profile: profile.data,
      },
    };
  }),
]);
