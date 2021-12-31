import { changeEmailAndPasswordHandler } from '../../handlers/auth/changeEmailAndPassword';
import { ProtectedNavigation } from '../../structure/navigation';

export const changeEmailAndPasswordNavigation = ProtectedNavigation([
  changeEmailAndPasswordHandler,
]);
