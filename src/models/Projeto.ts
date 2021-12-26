import { Curso } from './Curso';
import { Endereco } from './Endereco';

export type InformacoesProjeto = {
  /**
   * Identificador do documento do Projeto em questão.
   */
  id: string;
  nome: string;
  descricao: string;
  email: string;
  telefone: number;
  /**
   * Referência de tempo de quando foi feita a requisição para a entrada do projeto no sistema.
   */
  requisicaoEntradaEm: Date;
  endereco: Endereco;
};

/**
 * Representação do projeto no sistema.
 * Esse projeto pode ter sido ou não aprovado no sistema, fato que deverá ser feito pelo
 * administrador e deverá criar ao mesmo tempo uma conta de acesso para o projeto com uma senha
 * aleatória que deverá ser enviada ao projeto manualmente para que ele possa acessar o sistema
 * e eventualmente fazer a alteração de senha.
 */
export type Projeto = InformacoesProjeto &
  (
    | {
        aprovado: false;
      }
    | {
        aprovado: true;
        /**
         * Perfil responsável pela gerência do projeto. Será definido quando o projeto for aprovado e houver uma
         * criação de perfil para o mesmo.
         */
        idPerfilResponsavel: string;
        /**
         * Referência de tempo de quando a entrada do projeto no sistema foi aprovada.
         */
        entradaEm: Date;
        /**
         * Cursos aos quais o projeto mantém.
         */
        cursos: Curso[];
      }
  );
