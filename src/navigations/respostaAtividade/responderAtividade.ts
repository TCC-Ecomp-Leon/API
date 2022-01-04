import { responderAtividadeHandler } from '../../handlers/respostaAtividade/responderAtividade';
import { ProtectedNavigation } from '../../structure/navigation';

export const responderAtividadeNavigation = ProtectedNavigation([
  responderAtividadeHandler,
]);
