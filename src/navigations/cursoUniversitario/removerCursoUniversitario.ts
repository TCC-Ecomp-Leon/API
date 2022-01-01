import { removerCursoUniversitarioHandler } from '../../handlers/cursoUniversitario.ts/removerCursoUniversitario';
import { RegraPerfil } from '../../models';
import { ProtectedNavigation } from '../../structure/navigation';

export const removerCursoUniversitarioNavigation = ProtectedNavigation(
  [removerCursoUniversitarioHandler],
  (profile) => profile.regra === RegraPerfil.Administrador
);
