import { Perfil } from '../../models';
import { requestResetPassword } from '../../services/authentification/firebaseAuth';
import Context from '../../structure/context';
import Handler from '../../structure/handler';
import { NavigationResult } from '../../structure/navigation';

export const resetPasswordHandler = new Handler(
  async (context: Context): Promise<NavigationResult<null>> => {
    const userProfile = context.getVariable<Perfil>('profile');
    const request = await requestResetPassword(userProfile.email);

    if (!request.success) {
      throw request.error;
    }

    return {
      status: 200,
      body: null,
    };
  }
);
