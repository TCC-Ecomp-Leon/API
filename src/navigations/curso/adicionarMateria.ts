import { adicionarMateriaHandler } from '../../handlers/curso/adicionarMateria';
import { ProtectedNavigation } from '../../structure/navigation';

export const adicionarMateriaNavigation = ProtectedNavigation([
  adicionarMateriaHandler,
]);
