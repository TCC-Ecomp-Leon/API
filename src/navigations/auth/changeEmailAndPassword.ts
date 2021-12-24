import { changeEmailAndPasswordHandler } from '../../handlers/auth/changeEmailAndPassword';
import Navigation from '../../structure/navigation';

export const changeEmailAndPasswordNavigation = new Navigation([
  changeEmailAndPasswordHandler,
]);
