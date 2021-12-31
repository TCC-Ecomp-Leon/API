import { getCodigosHandler } from '../../handlers/codigoDeEntrada/getCodigos';
import { ProtectedNavigation } from '../../structure/navigation';

export const getCodigosNavigation = ProtectedNavigation([getCodigosHandler]);
