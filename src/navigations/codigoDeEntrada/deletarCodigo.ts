import { deletarCodigoHandler } from '../../handlers/codigoDeEntrada/deletarCodigo';
import Navigation from '../../structure/navigation';

export const deletarCodigoNavigation = new Navigation([deletarCodigoHandler]);
