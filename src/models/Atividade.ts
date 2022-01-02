export enum TipoAtividade {
  Alternativa = 1,
  Dissertativa = 2,
  BancoDeQuestoes = 3,
}

type InformacoesAtividade = {
  /**
   * Identificador da atividade em questão. Informação que será preenchida pela API.
   */
  id: string;
  /**
   * Nome da atividade em questão.
   */
  nome: string;
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
};

/**
 * Estrutura de dados para cada uma das questões de uma atividade alternativa.
 */
export type QuestaoAlternativa = {
  idQuestao: string;
  enunciado: string;
  peso: number;
  alternativas: { item: string; value: boolean }[];
};

/**
 * Estrutura de dados para cada uma das questões de uma atividade dissertativa.
 */
export type QuestaoDissertativa = {
  idQuestao: string;
  enunciado: string;
  peso: number;
  respostaEsperada:
    | { foto: false; texto: string }
    | { foto: true; imagem: string };
};

/**
 * Modelagem da atividade no sistema.
 * Atualmente essa atividade pode ser alternativa, dissertativa ou de banco de questões.
 */
export type Atividade = InformacoesAtividade &
  (
    | {
        /**
         * Atividade do tipo banco de questões.
         */
        tipoAtividade: TipoAtividade.BancoDeQuestoes;
        /**
         * Referência de tempo de quando acontecerá a abertura da atividade para respostas.
         */
        aberturaRespostas: Date;
        /**
         * Referência de tempo de quando acontecerá o fechamento da atividade para respostas.
         */
        fechamentoRespostas: Date;
        /**
         * Lista de assuntos envolvidos na elaboração desse banco de questão.
         * Essas informações serão usadas para filtrar as atividades de forma mais simples.
         */
        assuntos: string[];
        /**
         * Tempo que será contabilizado ao universitário pela sua colaboração na atividade.
         */
        tempoColaboracao: number;
      }
    | {
        tipoAtividade: TipoAtividade.Alternativa;
        /**
         * Referência de tempo de quando acontecerá a abertura da atividade para respostas.
         */
        aberturaRespostas: Date;
        /**
         * Referência de tempo de quando acontecerá o fechamento da atividade para respostas.
         */
        fechamentoRespostas: Date;
        /**
         * Nota que será usada como referência para uma nota máxima. Ex: atividade de 0-10 esse valor seria 10.
         */
        notaReferencia: number;
        /**
         * Configuração de cada uma das questões da atividade.
         */
        itens: QuestaoAlternativa[];
      }
    | {
        tipoAtividade: TipoAtividade.Dissertativa;
        /**
         * Referência de tempo de quando acontecerá a abertura da atividade para respostas.
         */
        aberturaRespostas: Date;
        /**
         * Referência de tempo de quando acontecerá o fechamento da atividade para respostas.
         * Também será utilizada como referência para quando estará aberta a correção colaborativa.
         */
        fechamentoRespostas: Date;
        /**
         * Referência de tempo de quando acontecerá o fechamento das correções.
         */
        fechamentoCorrecoes: Date;
        /**
         * Nota que será usada como referência para uma nota máxima. Ex: atividade de 0-10 esse valor seria 10.
         */
        notaReferencia: number;
        /**
         * Configuração de cada uma das questões da atividade.
         */
        itens: QuestaoDissertativa[];
        /**
         * Tempo que será contabilizado ao universitário pela sua colaboração na atividade.
         */
        tempoColaboracao: number;
      }
  );
