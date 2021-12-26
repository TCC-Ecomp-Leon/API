import { getProjetosNaoAprovadosHandler } from '../../handlers/projeto/getProjetosNaoAprovados';
import { RegraPerfil } from '../../models';
import { ProtectedNavigation } from '../../structure/navigation';

export const getProjetosNaoAprovadosNavigation = ProtectedNavigation(
  [getProjetosNaoAprovadosHandler],
  (perfil) => perfil.regra === RegraPerfil.Administrador
);
