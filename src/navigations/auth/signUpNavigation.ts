import { signUpHandler } from '../../handlers/auth/signUpHandler';
import { ProfileValidator } from '../../schemas/profile';
import Navigation from '../../structure/navigation';

export const signUpNavigation = new Navigation([
  signUpHandler(ProfileValidator, async (profile, db, session) => {
    return { success: true, data: null };
  }),
]);
