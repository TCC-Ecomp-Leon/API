import { v4 as uuid } from 'uuid';
import { Db, ClientSession } from 'mongodb';
import {
  ColaboracaoAtividade,
  CursoUniversitario,
  InformacoesUniversitarioAprovado,
  InformacoesUniversitario,
} from '../../models';
import { DatabaseResult } from '../../structure/databaseResult';
import Database from '../data/Database';

const collection = 'Universitario';

const sufixoEmailInstitucional = 'unifesp.br';

const emailInstitucionalValido = (email: string): boolean => {
  const fields = email.split('@');

  if (fields.length !== 2) return false;
  return fields[1] === sufixoEmailInstitucional;
};

const readInformacoesUniversitario = async (
  email: string,
  emailValidado: boolean,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<InformacoesUniversitario>> => {
  if (!emailValidado || !emailInstitucionalValido(email)) {
    return {
      success: true,
      data: {
        universitario: false,
      },
    };
  } else {
    const identificadorUniversitario: keyof InformacoesUniversitarioAprovado =
      'email';

    const informacoes =
      await Database.readData<InformacoesUniversitarioAprovado>(
        collection,
        [{ key: identificadorUniversitario, value: email }],
        db,
        session
      );
    if (!informacoes.success) {
      const informacoesUniversitario: InformacoesUniversitarioAprovado = {
        graduacao: undefined,
        email: email,
        atividadesQueColaborou: [],
      };
      const gravarInformacoes =
        await Database.addData<InformacoesUniversitarioAprovado>(
          collection,
          informacoesUniversitario,
          db,
          session
        );
      if (!gravarInformacoes.success) {
        throw gravarInformacoes.error;
      }

      return {
        success: true,
        data: {
          universitario: true,
          ...informacoesUniversitario,
        },
      };
    }

    return {
      success: true,
      data: {
        universitario: true,
        ...informacoes.data,
      },
    };
  }
};

const atualizarCurso = async (
  emailUniversitario: string,
  curso: CursoUniversitario,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<null>> => {
  const identificadorUniversitario: keyof InformacoesUniversitarioAprovado =
    'email';
  const campoGraduacao: keyof InformacoesUniversitarioAprovado = 'graduacao';
  const atualizacao: InformacoesUniversitarioAprovado['graduacao'] = {
    atualizadoEm: new Date(),
    curso: curso,
  };

  return Database.updateGenericData(
    collection,
    [{ key: identificadorUniversitario, value: emailUniversitario }],
    [{ key: campoGraduacao, value: atualizacao }],
    db,
    session
  );
};

const atrelarColaboracao = (
  emailUniversitario: string,
  idResposta: string,
  idAtividade: string,
  horasConfiguradas: number,
  db: Db,
  session: ClientSession,
  aprovada?: boolean
): Promise<DatabaseResult<null>> => {
  const identificadorUniversitario: keyof InformacoesUniversitarioAprovado =
    'email';
  const campoColaboracoes: keyof InformacoesUniversitarioAprovado =
    'atividadesQueColaborou';

  let colaboracao: ColaboracaoAtividade = {
    idResposta: idResposta,
    idAtividade: idAtividade,
    horas: horasConfiguradas,
    aprovado: false,
  };

  if (aprovada) {
    colaboracao = {
      ...colaboracao,
      aprovado: true,
      horasEmitidas: false,
    };
  }

  return Database.updatePushData(
    collection,
    [{ key: identificadorUniversitario, value: emailUniversitario }],
    campoColaboracoes,
    colaboracao,
    db,
    session
  );
};

const aprovarAtividades = (
  idRespostas: string[],
  db: Db,
  session: ClientSession
) => {
  const campoPesquisaAtividades: keyof ColaboracaoAtividade = 'idResposta';
  const campoAprovar = 'atividadesQueColaborou.$[].aprovado';

  return Database.updateGenericDatas(
    collection,
    [{ key: campoPesquisaAtividades, value: { $in: idRespostas } }],
    [{ key: campoAprovar, value: true }],
    db,
    session
  );
};

const registrarEmissaoHoras = (
  idRespostas: string[],
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<null>> => {
  const campoPesquisaAtividades: keyof ColaboracaoAtividade = 'idResposta';
  const campoEmissao = 'atividadesQueColaborou.$[].horasEmitidas';

  return Database.updateGenericDatas(
    collection,
    [{ key: campoPesquisaAtividades, value: { $in: idRespostas } }],
    [{ key: campoEmissao, value: true }],
    db,
    session
  );
};

const lerAtividadesNecessitandoAprovacao = async (
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<ColaboracaoAtividade[]>> => {
  const campoPesquisa =
    'atividadesQueColaborou.atividadesQueColaborou.aprovado';

  const informacoes = await Database.readDatas<
    InformacoesUniversitarioAprovado,
    InformacoesUniversitarioAprovado
  >(collection, [{ key: campoPesquisa, value: false }], db, session);

  let lista: ColaboracaoAtividade[] = [];

  if (!informacoes.success) return informacoes;

  informacoes.data.forEach((informacao) => {
    lista = [...lista, ...informacao.atividadesQueColaborou];
  });

  return {
    success: true,
    data: lista,
  };
};

export default {
  emailInstitucionalValido,
  readInformacoesUniversitario,
  atualizarCurso,
  atrelarColaboracao,
  registrarEmissaoHoras,
  aprovarAtividades,
  lerAtividadesNecessitandoAprovacao,
};
