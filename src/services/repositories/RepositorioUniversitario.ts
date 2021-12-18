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
    if (!informacoes.success) return informacoes;

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
  idAtividades: string[],
  db: Db,
  session: ClientSession
) => {
  const campoPesquisaAtividades: keyof ColaboracaoAtividade = 'idAtividade';
  const campoAprovar = 'atividadesQueColaborou.$[].aprovado';

  return Database.updateGenericDatas(
    collection,
    [{ key: campoPesquisaAtividades, value: { $in: idAtividades } }],
    [{ key: campoAprovar, value: true }],
    db,
    session
  );
};

const registrarEmissaoHoras = (
  idAtividades: string[],
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<null>> => {
  const campoPesquisaAtividades: keyof ColaboracaoAtividade = 'idAtividade';
  const campoEmissao = 'atividadesQueColaborou.$[].horasEmitidas';

  return Database.updateGenericDatas(
    collection,
    [{ key: campoPesquisaAtividades, value: { $in: idAtividades } }],
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
