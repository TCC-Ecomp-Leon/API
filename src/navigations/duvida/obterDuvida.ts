import { obterDuvidaHandler } from '../../handlers/duvida/obterDuvida';
import { ProtectedNavigation } from '../../structure/navigation';

export const obterDuvidaNavigation = ProtectedNavigation([obterDuvidaHandler]);
