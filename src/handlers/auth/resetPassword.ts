import { Perfil } from '../../models';
import { requestResetPassword } from '../../services/authentification/firebaseAuth';
import Context from '../../structure/context';
import Handler from '../../structure/handler';
import { NavigationResult } from '../../structure/navigation';

export const resetPasswordHandler = new Handler(
  async (context: Context): Promise<NavigationResult<null>> => {
    const email = context.params['email'] as string;
    const request = await requestResetPassword(email);

    if (!request.success) {
      throw request.error;
    }

    return {
      status: 200,
      body: null,
    };
  }
);
