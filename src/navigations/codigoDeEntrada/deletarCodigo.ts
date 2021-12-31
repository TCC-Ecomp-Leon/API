import { deletarCodigoHandler } from '../../handlers/codigoDeEntrada/deletarCodigo';
import { ProtectedNavigation } from '../../structure/navigation';

export const deletarCodigoNavigation = ProtectedNavigation([
  deletarCodigoHandler,
]);
