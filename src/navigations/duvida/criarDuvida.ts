import { criarDuvidaHandler } from '../../handlers/duvida/criarDuvida';
import { ProtectedNavigation } from '../../structure/navigation';

export const criarDuvidaNavigation = ProtectedNavigation([criarDuvidaHandler]);
