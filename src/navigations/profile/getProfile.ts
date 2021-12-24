import { getProfileHandler } from '../../handlers/profile/getProfile';
import { ProtectedNavigation } from '../../structure/navigation';

export const getProfileNavigation = ProtectedNavigation([getProfileHandler]);
