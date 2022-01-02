import { criarAtividadeHandler } from '../../handlers/atividade/criarAtividade';
import { ProtectedNavigation } from '../../structure/navigation';

export const criarAtividadeNavigation = ProtectedNavigation([
  criarAtividadeHandler,
]);
