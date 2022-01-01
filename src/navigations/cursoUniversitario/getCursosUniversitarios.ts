import { getCursosUniversitariosHandler } from '../../handlers/cursoUniversitario.ts/getCursosUniversitarios';
import { ProtectedNavigation } from '../../structure/navigation';

export const getCursosUniversitariosNavigation = ProtectedNavigation([
  getCursosUniversitariosHandler,
]);
