import { resetPasswordHandler } from '../../handlers/auth/resetPassword';
import Navigation from '../../structure/navigation';

export const resetPasswordNavigation = new Navigation([resetPasswordHandler]);
