import { getCodigosHandler } from '../../handlers/codigoDeEntrada/getCodigos';
import Navigation from '../../structure/navigation';

export const getCodigosNavigation = new Navigation([getCodigosHandler]);
