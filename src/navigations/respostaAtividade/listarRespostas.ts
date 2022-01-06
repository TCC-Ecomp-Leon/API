import { listarRespostasHandler } from '../../handlers/respostaAtividade/listarRespostas';
import { ProtectedNavigation } from '../../structure/navigation';

export const listarRespostasNavigation = ProtectedNavigation([
  listarRespostasHandler,
]);
