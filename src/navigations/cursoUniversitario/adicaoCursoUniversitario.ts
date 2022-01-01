import { adicaoCursoUniversitarioHandler } from '../../handlers/cursoUniversitario.ts/adicaoCursoUniversitario';
import { RegraPerfil } from '../../models';
import { ProtectedNavigation } from '../../structure/navigation';

export const adicaoCursoUniversitarioNavigation = ProtectedNavigation(
  [adicaoCursoUniversitarioHandler],
  (profile) => profile.regra === RegraPerfil.Administrador
);
