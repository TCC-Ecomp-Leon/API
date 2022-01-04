import { removerQuestaoBancoDeQuestoesHandler } from '../../handlers/bancoDeQuestoes/removerQuestao';
import { ProtectedNavigation } from '../../structure/navigation';

export const removerQuestaoBancoDeQuestoesNavigation = ProtectedNavigation([
  removerQuestaoBancoDeQuestoesHandler,
]);
