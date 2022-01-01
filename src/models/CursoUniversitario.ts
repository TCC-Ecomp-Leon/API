/**
 * Estrutura que será usada para armazenar os cursos da universidade cadastros no sistema associados
 * a UNIFESP que poderão ser usados pelos universitários em conjunto com o seu perfil.
 * Esses registros deverão ser feitos pelo administrador do sistema.
 */
export type CursoUniversitario = {
  /**
   * Identificador do documento do Curso Universitário em questão.
   */
  id: string;
  nome: string;
  descricao: string;
  /**
   * Quantidade de semestres previstos para a formação regular de alguém que realiza o curso.
   */
  semestresPrevistos: number;
  /**
   * Um curso pode ter um curso anterior como todos os cursos específicos do BCT na UNIFESP SJC.
   */
  cursoAnterior: CursoUniversitario | null;
};
