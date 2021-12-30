import { RegistrarCursoHandler } from '../../handlers/curso/registrarCurso';
import { ProtectedNavigation } from '../../structure/navigation';

export const registrarCursoNavigation = ProtectedNavigation([
  RegistrarCursoHandler,
]);
