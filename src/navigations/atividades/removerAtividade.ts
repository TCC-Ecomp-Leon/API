import { removerAtividadeHandler } from '../../handlers/atividade/removerAtividade';
import { ProtectedNavigation } from '../../structure/navigation';

export const removerAtividadeNavigation = ProtectedNavigation([
  removerAtividadeHandler,
]);
