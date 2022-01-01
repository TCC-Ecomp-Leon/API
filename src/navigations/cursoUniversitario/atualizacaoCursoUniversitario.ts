import { atualizacaoCursoUniversitarioHandler } from '../../handlers/cursoUniversitario.ts/atualizacaoCursoUniversitario';
import { RegraPerfil } from '../../models';
import { ProtectedNavigation } from '../../structure/navigation';

export const atualizacaoCursoUniversitarioNavigation = ProtectedNavigation(
  [atualizacaoCursoUniversitarioHandler],
  (profile) => profile.regra === RegraPerfil.Administrador
);
