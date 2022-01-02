import { listaDeDuvidasHandler } from '../../handlers/duvida/listaDeDuvidas';
import { ProtectedNavigation } from '../../structure/navigation';

export const listarDuvidasNavigation = ProtectedNavigation([
  listaDeDuvidasHandler,
]);
