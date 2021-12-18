import { Curso } from './Curso';
import { CursoUniversitario } from './CursoUniversitario';
import { Materia } from './Materia';
import { Projeto } from './Projeto';

/**
 * Regra de uso do perfil de um usuário no sistema.
 */
export enum RegraPerfil {
  /**
   * Conta responsável pela aplicação como um todo. Ela terá acesso a todas informações do sistema.
   */
  Administrador = 1,
  /**
   * Conta responsável pela gerência de um projeto no sistema. Cada projeto terá uma conta desse tipo.
   */
  Projeto = 2,
  /**
   * Demais usos da aplicação que terão regras de uso atreladas aos relacionamentos armazenados no
   * banco de dados para cada um dos usuários.
   */
  Geral = 3,
}

export type InformacoesPerfil = {
  /**
   * Identificador único gerado pelo sistema no momento de ingresso para armazenar um usuário de
   * forma mais independente ao seu email, sendo o nome do documento de perfil do mesmo.
   */
  id: string;
  /**
   * Principal forma de identificação de um usuário no sistema, fazendo a ponte entre o sistema de
   * autentificação e o perfil do usuário.
   */
  email: string;
  nome: string;
  telefone: number;
  /**
   * Referência de tempo da entrada do perfil no sistema.
   */
  entradaEm: Date;
  /**
   * Imagem de perfil em Base 64.
   */
  fotoPerfil: string;
};

export type ColaboracaoAtividade = {
  /**
   * Id da atividade em que ele colaborou.
   */
  idAtividade: string;
  /**
   * Quantas horas essa atividade colaborativa está configurada para emitir.
   */
  horas: number;
} & (
  | {
      /**
       * Se a atividade colaborativa já foi aprovada, ou seja, as horas complementares
       * podem ser emitidas para o perfil.
       * Essa informação será preenchida diretamente como true para a correção de uma
       * atividade dissertativa, mas para a atividade de banco de questões somente depois
       * de alguma das questões elaboradas terem sido aprovadas.
       */
      aprovado: false;
    }
  | {
      /**
       * Se a atividade colaborativa já foi aprovada, ou seja, as horas complementares
       * podem ser emitidas para o perfil.
       * Essa informação será preenchida diretamente como true para a correção de uma
       * atividade dissertativa, mas para a atividade de banco de questões somente depois
       * de alguma das questões elaboradas terem sido aprovadas.
       */
      aprovado: true;
      horasEmitidas: boolean;
    }
);

export type InformacoesUniversitarioAprovado = {
  email: string;
  /**
   * O universitário pode ou não ter uma graduação preenchida por ele mesmo no perfil.
   */
  graduacao?: {
    atualizadoEm: Date;
    curso: CursoUniversitario;
  };

  atividadesQueColaborou: ColaboracaoAtividade[];
};

/**
 * Estrutura que será usada para representar se um perfil em questão é universitário e se for também
 * conter as informações relacionadas a sua graduação.
 * Ser um universitário estará relacionado a ter um email institucional verificado no sistema.
 */
export type InformacoesUniversitario =
  | {
      universitario: false;
    }
  | (InformacoesUniversitarioAprovado & { universitario: true });

type InformacoesCurso =
  | {
      alunoParceiro: false;
    }
  | {
      alunoParceiro: true;
      cursos: Curso[];
    };

type InformacoesProfessor =
  | {
      professor: false;
    }
  | {
      professor: true;
      materiasProfessor: Materia[];
    };

export type Perfil = InformacoesPerfil &
  (
    | {
        regra: RegraPerfil.Administrador | RegraPerfil.Projeto;
      }
    | {
        regra: RegraPerfil.Geral;
        cpf: string;
        /**
         * Informações nas quais o usuário é passivo, ou seja, ele não tem controle,
         * mas são determinadas por outros dados que estarão em outros locais do
         * banco de dados.
         */
        associacoes: {
          aluno: InformacoesCurso;
          professor: InformacoesProfessor;
        };
        universitario: InformacoesUniversitario;
      }
  );
