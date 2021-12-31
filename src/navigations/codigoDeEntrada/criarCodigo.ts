import { criarCodigoHandler } from '../../handlers/codigoDeEntrada/criarCodigo';
import { ProtectedNavigation } from '../../structure/navigation';

export const criarCodigoNavigation = ProtectedNavigation([criarCodigoHandler]);
