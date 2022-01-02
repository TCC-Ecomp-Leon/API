import { iteragirDuvidaHandler } from '../../handlers/duvida/iteragirDuvida';
import { ProtectedNavigation } from '../../structure/navigation';

export const iteragirDuvidaNavigation = ProtectedNavigation([
  iteragirDuvidaHandler,
]);
