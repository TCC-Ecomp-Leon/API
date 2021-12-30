import { atualizarCursoHandler } from '../../handlers/curso/atualizarCurso';
import { ProtectedNavigation } from '../../structure/navigation';

export const atualizarCursoNavigation = ProtectedNavigation([
  atualizarCursoHandler,
]);
