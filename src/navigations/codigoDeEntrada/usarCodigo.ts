import { usarCodigoHandler } from '../../handlers/codigoDeEntrada/usarCodigo';
import { ProtectedNavigation } from '../../structure/navigation';

export const usarCodigoNavigation = ProtectedNavigation([usarCodigoHandler]);
