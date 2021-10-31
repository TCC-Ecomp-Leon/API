import { signInHandler } from '../../handlers/auth/signInHandler';
import Navigation from '../../structure/navigation';

// TODO: Put the getProfile service here
export const signInNavigation = new Navigation([
  signInHandler(async (token, db, session) => ({ success: true, data: {} })),
]);
