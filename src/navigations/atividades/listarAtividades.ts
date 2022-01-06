import { listarAtividadesHandler } from '../../handlers/atividade/listarAtividades';
import { ProtectedNavigation } from '../../structure/navigation';

export const listarAtividadesNavigation = ProtectedNavigation([
  listarAtividadesHandler,
]);
