import { Atividade } from './Atividade';

/**
 * Estrutura de dados para representar uma matéria no sistema.
 * Aqui além das informações básicas precisamos do id do curso e do professor responsável.
 */
export type Materia = {
  id: string;
  idPerfilProfessor?: string;
  nome: string;
  descricao: string;
  idCurso: string;
};
