import { obterAtividadeHandler } from '../../handlers/atividade/obterAtividade';
import { ProtectedNavigation } from '../../structure/navigation';

export const obterAtividadeNavigation = ProtectedNavigation([
  obterAtividadeHandler,
]);
