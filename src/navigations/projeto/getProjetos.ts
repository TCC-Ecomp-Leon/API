import { getProjetosHandler } from '../../handlers/projeto/getProjetos';
import { ProtectedNavigation } from '../../structure/navigation';

export const getProjetosNavigation = ProtectedNavigation([getProjetosHandler]);
