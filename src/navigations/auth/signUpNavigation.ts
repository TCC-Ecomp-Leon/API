import { signUpHandler } from '../../handlers/auth/signUpHandler';
import Navigation from '../../structure/navigation';

export const signUpNavigation = new Navigation([signUpHandler]);
