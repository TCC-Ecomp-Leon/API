import { TipoAtividade } from './Atividade';

export enum EstadoRevisao {
  Nenhum = 1,
  Requisitada = 2,
  Finalizada = 3,
}

export type InformacoesRespostaAtividade = {
  /**
   * Identificador da resposta da atividade.
   */
  id: string;
  /**
   * Identificador da atividade a qual foi respondida.
   * Necessário validação pela API da validade dessa informação.
   */
  idAtividade: string;
  /**
   * Quando foi respondida.
   */
  respondidoEm: Date;
  idProjeto: string;
  idCurso: string | null;
  idMateria: string | null;
};

/**
 * Estrutura de dados para armazenar as respostas da questão alternativa.
 * Necessário validação do id da questão.
 */
export type RespostaAlternativa = {
  /**
   * Identificador da questão.
   * Uma resposta de atividade só será válida se tiver todos os identificadores de questões da atividade.
   */
  idQuestao: string;
  alternativas: { item: string; value: boolean }[];
};

/**
 * Estrutura de dados para armazenar as respostas da questão dissertativa.
 * Necessário validação do id da questão.
 */
export type RespostaDissertativa = {
  /**
   * Identificador da questão.
   * Uma resposta de atividade só será válida se tiver todos os identificadores de questões da atividade.
   */
  idQuestao: string;
  resposta: { foto: false; texto: string } | { foto: true; imagem: string };
};

export enum StatusRespostaDissertativa {
  Errado = 1,
  Certo = 2,
  ParcialmenteCerto = 3,
}

export type CorrecaoDissertativa = {
  /**
   * Identificador da questão.
   * Uma resposta de atividade só será válida se tiver todos os identificadores de questões da atividade.
   */
  idQuestao: string;
  /**
   * Nota atribuída à aquela questão.
   * Necessário validar se a nota está dentro do intervalo de valor da nota da atividade dividido pela quantidade
   * de questões e multiplicado pelo peso da questão.
   * Necessário validar também o status e a coerência dessa nota.
   */
  nota: number;
  /**
   * Status da resposta, ou seja, se está errada, correta ou parcialmente correta.
   */
  status: StatusRespostaDissertativa;
  comentarios: string;
  idProjeto: string;
  idCurso: string | null;
  idMateria: string | null;
};

/**
 * Estrutura de dados para cada uma das questões da atividade do banco de questões.
 */
export type QuestaoBancoDeQuestoes = {
  idAtividade: string;
  idQuestao: string;
  enunciado: string;
  alternativas: { item: string; value: boolean }[];
};

export type AvaliacaoRespostaBancoDeQuestoes = {
  avaliacaoQuestoes: { idQuestao: string; aprovada: boolean }[];
  comentario: string;
};

/**
 * Estrutura de dados para representar uma resposta de uma atividade e as alterações de estado que ela pode sofrer.
 * Um detalhe importante é que em uma atividade colaborativa pelo lado universitário (banco de questões e atividade dissertativa)
 * é necessário que quando houver uma colaboração universitária essa seja salva no perfil do universitário.
 */
export type RespostaAtividade = InformacoesRespostaAtividade &
  (
    | ({
        tipo: TipoAtividade.Alternativa;
        respostas: RespostaAlternativa[];
        /**
         * Por quem foi respondida.
         * Necessário validação pela API se o aluno tem permissão para responder aquela atividade e se ainda não respondeu.
         */
        idAluno: string;
      } & ({ encerrada: false } | { encerrada: true; nota: number }))
    | ({
        tipo: TipoAtividade.Dissertativa;
        respostas: RespostaDissertativa[];
        /**
         * Por quem foi respondida.
         * Necessário validação pela API se o aluno tem permissão para responder aquela atividade e se ainda não respondeu.
         */
        idAluno: string;
      } & (
        | { corrigida: false }
        | ({
            corrigida: true;
            horarioCorrecao: Date;
            idPerfilCorrecao: string;
            nota: number;
            correcaoQuestao: CorrecaoDissertativa[];
          } & (
            | {
                revisao: EstadoRevisao.Nenhum;
              }
            | {
                revisao: EstadoRevisao.Requisitada;
                revisaoRequisitadaEm: Date;
              }
            | {
                revisao: EstadoRevisao.Finalizada;
                revisaoRequisitadaEm: Date;
                revisaoAtendidaEm: Date;
                /**
                 * Revisão de cada uma das questões.
                 */
                revisaoQuestoes: CorrecaoDissertativa[];
                notaRevisao: number;
                notaAnteriorRevisao: number;
              }
          ))
      ))
    | ({
        tipo: TipoAtividade.BancoDeQuestoes;
        /**
         * Por qual universitário foi respondida.
         */
        idUniversitario: string;
        respostas: QuestaoBancoDeQuestoes[];
      } & (
        | {
            avaliada: false;
          }
        | ({
            avaliada: true;
            avaliadaEm: Date;
            /**
             * Identificador do perfil que avaliou as questões que foram inseridas para entrar para esse banco de questões.
             */
            avaliadaPor: string;
          } & AvaliacaoRespostaBancoDeQuestoes)
      ))
  );
