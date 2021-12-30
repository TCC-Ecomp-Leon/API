import { getProjetoHandler } from '../../handlers/projeto/getProjeto';
import { ProtectedNavigation } from '../../structure/navigation';

export const getProjetoNavigation = ProtectedNavigation([getProjetoHandler]);
