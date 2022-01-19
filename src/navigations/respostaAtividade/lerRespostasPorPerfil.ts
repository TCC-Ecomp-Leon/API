import { lerRespostasPorPerfilHandler } from '../../handlers/respostaAtividade/lerRespostasPorPerfil';
import { ProtectedNavigation } from '../../structure/navigation';

export const lerRespostasPorPerfilNavigation = ProtectedNavigation([
  lerRespostasPorPerfilHandler,
]);
