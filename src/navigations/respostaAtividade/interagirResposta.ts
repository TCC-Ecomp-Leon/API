import { interagirRespostaHandler } from '../../handlers/respostaAtividade/interagirResposta';
import { ProtectedNavigation } from '../../structure/navigation';

export const interagirRespostaNavigation = ProtectedNavigation([
  interagirRespostaHandler,
]);
