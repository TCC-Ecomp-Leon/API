import { deleteProfileHandler } from '../../handlers/profile/deleteProfileHandler';
import { ProtectedNavigation } from '../../structure/navigation';

export const deleteProfileNavitation = ProtectedNavigation([
  deleteProfileHandler,
]);
