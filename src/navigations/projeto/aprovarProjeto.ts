import { aprovarProjetoHandler } from '../../handlers/projeto/aprovarProjeto';
import { RegraPerfil } from '../../models';
import { ProtectedNavigation } from '../../structure/navigation';

export const aprovarProjetoNavigation = ProtectedNavigation(
  [aprovarProjetoHandler],
  (perfil) => perfil.regra === RegraPerfil.Administrador
);
