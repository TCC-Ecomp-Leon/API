import { updateProfileValidatorHandler } from '../../handlers/profile/udpateProfileValidator';
import { updateProfileHandler } from '../../handlers/profile/updateProfile';
import { ProtectedNavigation } from '../../structure/navigation';

export const updateProfileNavigation = ProtectedNavigation([
  updateProfileValidatorHandler,
  updateProfileHandler,
]);
