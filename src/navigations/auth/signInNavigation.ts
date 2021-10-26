import { signInHandler } from '../../handlers/auth/signInHandler';
import Navigation from '../../structure/navigation';

// TODO: Put the getProfile service here
export const signInNavigation = new Navigation([
  signInHandler(async (token, session) => ({ success: true, data: {} })),
]);
