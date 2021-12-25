import { criarCodigoHandler } from '../../handlers/codigoDeEntrada/criarCodigo';
import Navigation from '../../structure/navigation';

export const criarCodigoNavigation = new Navigation([criarCodigoHandler]);
