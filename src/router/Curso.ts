import { Materia } from './Materia';

/**
 * Estrutura usada para representar um curso no sistema.
 * Esse curso não deverá ser reaproveitado entre semestres ou anos, devendo ser realizado
 * um novo registro no sistema para o gerenciamento correto dessa nova turma, matérias e
 * professores.
 */
export type Curso = {
  id: string;
  idProjeto: string;
  nome: string;
  descricao: string;
  /**
   * Referência de tempo do início do curso.
   */
  inicioCurso: Date;
  /**
   * Referência de tempo do fim do curso.
   */
  fimCurso: Date;
  /**
   * Referência de tempo de quando foi feita a última atualização no curso.
   */
  atualizadoEm: Date;

  /**
   * Lista de identificadores de perfil dos usuários que fazem parte daquela turma.
   */
  turma: string[];

  /**
   * Lista de matérias do curso.
   */
  materias: Materia[];
};
