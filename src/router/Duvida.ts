/**
 * Estrutura que será utilizada para armazenar as dúvidas que podem ser lançadas pelos alunos
 * dos projetos parceiros. Essas dúvidas funcionarão como uma espécie de tópico em um fórum
 * e estarão abertas para respostas tanto de universitários quando do projeto em questão.
 */
export type Duvida = {
  id: string;
  titulo: string;
  descricao: string;
  /**
   * Qual aluno de projeto parceiro criou a dúvida.
   */
  idAluno: string;
  /**
   * A qual curso esse aluno de projeto parceiro pertence.
   * Essa informação será utilizada para obter qual é o projeto parceiro em questão.
   */
  idCursoAluno: string;
  /**
   * Se preenchida significará a qual matéria essa dúvida está relacionada.
   * Essa informação pode ser null se não é de uma matéria, mas somente de curso.
   */
  idMateria: string | null;
  /**
   * Se preenchida significará que a dúvida é relativa a um curso universitário.
   * Essa informação pode ser null se não é de uma curso universitário.
   */
  idCursoUniversitario: string | null;
  /**
   * Cada uma das mensagens daquele tópico. Será armazenada quem criou essa
   * mensagem, quando e qual é a mensagem.
   */
  mensagens: {
    idPerfil: string;
    horario: Date;
    mensagem: string;
  }[];
  /**
   * Se a dúvida já foi resolvida ou não, funcionando como uma espécie de tópico
   * fechado no fórum. Poderá ser marcada apenas pelos administradores, pelo projeto
   * ao qual o aluno faz parte ou pelo próprio aluno que criou o tópico.
   */
  resolvida: boolean;
};
