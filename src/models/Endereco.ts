import { Localizacao } from './estruturas/Localizacao';

/**
 * Estrutura de dados para representar as informações relativas a algum endereço no sistema.
 */
export type Endereco = {
  rua: string;
  numero: number;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: number;
  localizacao: Localizacao;
};
