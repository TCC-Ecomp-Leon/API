import { atualizarProjetoHandler } from '../../handlers/projeto/atualizarProjeto';
import { ProtectedNavigation } from '../../structure/navigation';

export const atualizarProjetoNavigation = ProtectedNavigation([
  atualizarProjetoHandler,
]);
