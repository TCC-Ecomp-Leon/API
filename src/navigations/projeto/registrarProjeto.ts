import { registrarProjetoHandler } from '../../handlers/projeto/registrarProjeto';
import Navigation from '../../structure/navigation';

export const registrarProjetoNavigation = new Navigation([
  registrarProjetoHandler,
]);
