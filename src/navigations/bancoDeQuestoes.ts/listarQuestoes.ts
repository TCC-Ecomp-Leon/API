import { listarQuestoesBancoDeQuestoesHandler } from '../../handlers/bancoDeQuestoes/listarQuestoes';
import { ProtectedNavigation } from '../../structure/navigation';

export const listarQuestoesBancoDeQuestoesNavigation = ProtectedNavigation([
  listarQuestoesBancoDeQuestoesHandler,
]);
