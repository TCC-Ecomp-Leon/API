import { signInHandler } from '../../handlers/auth/signInHandler';
import RepositorioPerfil from '../../services/repositories/RepositorioPerfil';
import Navigation from '../../structure/navigation';

export const signInNavigation = new Navigation([
  signInHandler(async (userId, email, emailVerificado, db, session) => {
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

    return {
      success: true,
      data: profile.data,
    };
  }),
]);
