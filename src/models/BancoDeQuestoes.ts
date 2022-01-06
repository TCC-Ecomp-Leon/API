import { QuestaoBancoDeQuestoes } from './RespostaAtividade';

export type BancoDeQuestoes = {
  id: string;
  /**
   * Referência do horário quando a atividade foi criada.
   * Informação que será preenchida pela API.
   */
  criadoEm: Date;
  idProjeto: string;
  /**
   * Identificador do curso ao qual a atividade está atrelada.
   * Necessário validar se o curso é válido.
   */
  idCurso: string;
  /**
   * Identificador da matéria a qual a atividade pode estar atrelada.
   * Essa informação pode ser null se é uma atividade que não é de uma matéria, mas somente de curso.
   * Necessário validar se é uma matéria válida dentro do curso.
   */
  idMateria: string | null;

  /**
   * Questão em si.
   */
  questao: QuestaoBancoDeQuestoes;
  assuntos: string[];
};
