import { v4 as uuid } from 'uuid';
import { Db, ClientSession } from 'mongodb';
import {
  EstadoRevisao,
  RespostaAtividade,
  RespostaAlternativa,
  RespostaDissertativa,
  StatusRespostaDissertativa,
  CorrecaoDissertativa,
  QuestaoBancoDeQuestoes,
  Atividade,
  TipoAtividade,
  QuestaoDissertativa,
  QuestaoAlternativa,
  AvaliacaoRespostaBancoDeQuestoes,
  BancoDeQuestoes,
} from 'tcc-models';
import { DatabaseResult } from '../../structure/databaseResult';
import Database, { SearchType } from '../data/Database';
import RepositorioAtividade from './RepositorioAtividade';
import _ from 'lodash';

import { collection as collectionAtividade } from './RepositorioAtividade';
import RepositorioBancoDeQuestoes from './RepositorioBancoDeQuestoes';

const collection = 'RespostaAtividade';

type EstruturaRespostaAlternativa = Omit<
  RespostaAtividade & { tipo: TipoAtividade.Alternativa },
  'encerrada'
>;
type EstruturaRespostaDissertativa = RespostaAtividade & {
  tipo: TipoAtividade.Dissertativa;
};
type EstruturaRespostaBancoDeQuestoes = RespostaAtividade & {
  tipo: TipoAtividade.BancoDeQuestoes;
};

const responderAtividadeAlternativa = async (
  idAtividade: string,
  idAluno: string,
  respostas: RespostaAlternativa[],
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<string>> => {
  const atividade: EstruturaRespostaAlternativa = {
    id: uuid(),
    idAtividade: idAtividade,
    respondidoEm: new Date(),
    tipo: TipoAtividade.Alternativa,
    respostas: respostas,
    idAluno: idAluno,
  };

  const add = await Database.addData<EstruturaRespostaAlternativa>(
    collection,
    atividade,
    db,
    session
  );

  if (!add.success) return add;

  return {
    success: true,
    data: atividade.id,
  };
};

const responderAtividadeDissertativa = async (
  idAtividade: string,
  idAluno: string,
  respostas: RespostaDissertativa[],
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<string>> => {
  const atividade: EstruturaRespostaDissertativa = {
    id: uuid(),
    idAtividade: idAtividade,
    respondidoEm: new Date(),
    tipo: TipoAtividade.Dissertativa,
    respostas: respostas,
    idAluno: idAluno,
    corrigida: false,
  };

  const add = await Database.addData<EstruturaRespostaDissertativa>(
    collection,
    atividade,
    db,
    session
  );

  if (!add.success) return add;

  return {
    success: true,
    data: atividade.id,
  };
};

const responderAtividadeBancoDeQuestoes = async (
  idAtividade: string,
  idUniversitario: string,
  respostas: QuestaoBancoDeQuestoes[],
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<string>> => {
  const atividade: EstruturaRespostaBancoDeQuestoes = {
    id: uuid(),
    idAtividade: idAtividade,
    respondidoEm: new Date(),
    tipo: TipoAtividade.BancoDeQuestoes,
    idUniversitario: idUniversitario,
    respostas: respostas,
    avaliada: false,
  };

  const add = await Database.addData<EstruturaRespostaBancoDeQuestoes>(
    collection,
    atividade,
    db,
    session
  );

  if (!add.success) return add;

  return {
    success: true,
    data: atividade.id,
  };
};

const lerResposta = async (
  id: string,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<RespostaAtividade>> => {
  const dado = await Database.readData<
    | EstruturaRespostaAlternativa
    | EstruturaRespostaDissertativa
    | EstruturaRespostaDissertativa
  >(collection, [{ key: 'id', value: id }], db, session);

  if (!dado.success) return dado;

  const resposta = dado.data;

  if (resposta.tipo === TipoAtividade.Alternativa) {
    const leituraAtividade = await RepositorioAtividade.lerAtividade(
      resposta.idAtividade,
      db,
      session
    );
    if (!leituraAtividade.success) return leituraAtividade;

    const atividade = leituraAtividade.data;
    if (atividade.tipoAtividade !== TipoAtividade.Alternativa) {
      throw Error(
        'Atividade que não é alternativa configurada com resposta alternativa'
      );
    }

    if (new Date() > atividade.fechamentoRespostas) {
      let somatorio = 0.0;
      let somatorioPesos = 0.0;
      const notaReferencia = atividade.notaReferencia;

      resposta.respostas.forEach((resposta) => {
        const { idQuestao, alternativas } = resposta;

        const questaoConfigurada: QuestaoAlternativa | undefined =
          atividade.itens.find((questao) => questao.idQuestao === idQuestao);
        if (questaoConfigurada === undefined) {
          throw Error(
            'Não foi possível encontrar a questão respondida na atividade'
          );
        }

        const alternativasConfiguradas = questaoConfigurada.alternativas;
        if (
          _.isEqual(
            alternativas.map((alternativa) => alternativa.value),
            alternativasConfiguradas.map((alternativa) => alternativa.value)
          )
        ) {
          somatorio = somatorio + questaoConfigurada.peso;
        }
        somatorioPesos = somatorioPesos + questaoConfigurada.peso;
      });

      const nota = (somatorio / somatorioPesos) * notaReferencia;

      return {
        success: true,
        data: {
          ...resposta,
          encerrada: true,
          nota: nota,
        },
      };
    } else {
      return {
        success: true,
        data: {
          ...resposta,
          encerrada: false,
        },
      };
    }
  } else {
    return {
      success: true,
      data: resposta,
    };
  }
};

const corrigirQuestaoDissertativa = (
  id: string,
  idPerfil: string,
  nota: number,
  correcaoQuestoes: CorrecaoDissertativa[],
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<null>> => {
  type Estrutura = EstruturaRespostaDissertativa & { corrigida: true };

  const atualizacao: Partial<Estrutura> = {
    id: id,
    corrigida: true,
    horarioCorrecao: new Date(),
    idPerfilCorrecao: idPerfil,
    nota: nota,
    correcaoQuestao: correcaoQuestoes,
    revisao: EstadoRevisao.Nenhum,
  };

  return Database.updatePartialData<Atividade>(
    collection,
    [{ key: 'id', value: id }],
    atualizacao,
    db,
    session
  );
};

const requisitarRevisaoAtividadeDissertativa = (
  id: string,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<null>> => {
  type Estrutura = EstruturaRespostaDissertativa & { corrigida: true };

  const atualizacao: Partial<Estrutura> = {
    revisao: EstadoRevisao.Requisitada,
    revisaoRequisitadaEm: new Date(),
  };

  return Database.updatePartialData<Atividade>(
    collection,
    [{ key: 'id', value: id }],
    atualizacao,
    db,
    session
  );
};

const finalizarRevisaoAtividadeDissertativa = (
  id: string,
  notaRevisao: number,
  notaAnteriorRevisao: number,
  revisaoQuestoes: CorrecaoDissertativa[],
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<null>> => {
  type Estrutura = EstruturaRespostaDissertativa & { corrigida: true };

  const atualizacao: Partial<Estrutura> = {
    id: id,
    revisao: EstadoRevisao.Finalizada,
    revisaoAtendidaEm: new Date(),
    revisaoQuestoes: revisaoQuestoes,
    notaRevisao: notaRevisao,
    notaAnteriorRevisao: notaAnteriorRevisao,
  };

  return Database.updatePartialData<Atividade>(
    collection,
    [{ key: 'id', value: id }],
    atualizacao,
    db,
    session
  );
};

const avaliarRespostasBanco = async (
  id: string,
  idAtividade: string,
  idPerfilAvaliador: string,
  avaliacoes: AvaliacaoRespostaBancoDeQuestoes,
  comentario: string,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<null>> => {
  const readAtividade = await RepositorioAtividade.lerAtividade(
    idAtividade,
    db,
    session
  );
  if (!readAtividade.success) return readAtividade;

  const readResposta = await lerResposta(id, db, session);
  if (!readResposta.success) return readResposta;

  const atividade = readAtividade.data;
  let resposta = readResposta.data;
  if (
    atividade.tipoAtividade !== TipoAtividade.BancoDeQuestoes ||
    resposta.tipo !== TipoAtividade.BancoDeQuestoes
  ) {
    throw Error(
      'Atividade ou resposta configuradas não sao do tipo banco de questões'
    );
  }

  const questoesBanco: QuestaoBancoDeQuestoes[] = [];

  avaliacoes.avaliacaoQuestoes.forEach((avaliacaoQuestao) => {
    const { idQuestao, aprovada } = avaliacaoQuestao;

    if (aprovada) {
      const respostas: QuestaoBancoDeQuestoes[] =
        resposta.respostas as QuestaoBancoDeQuestoes[];
      const questao = respostas.find(
        (resposta) => resposta.idQuestao === idQuestao
      );

      if (questao !== undefined) {
        questoesBanco.push(questao);
      }
    }
  });

  resposta = {
    ...resposta,
    avaliada: true,
    avaliadaEm: new Date(),
    avaliadaPor: idPerfilAvaliador,
    ...avaliacoes,
    comentario: comentario,
  };

  const atualizacaoResposta =
    await Database.updatePartialData<RespostaAtividade>(
      collectionAtividade,
      [{ key: 'id', value: resposta.id }],
      resposta,
      db,
      session
    );

  if (!atualizacaoResposta.success) return atualizacaoResposta;

  for (let i = 0; i < questoesBanco.length; i++) {
    const add = await RepositorioBancoDeQuestoes.adicionarQuestao(
      atividade,
      questoesBanco[i],
      db,
      session
    );
    if (!add.success) return add;
  }

  return {
    success: true,
    data: null,
  };
};

export default {
  responderAtividadeAlternativa,
  responderAtividadeDissertativa,
  responderAtividadeBancoDeQuestoes,
  lerResposta,
  corrigirQuestaoDissertativa,
  requisitarRevisaoAtividadeDissertativa,
  finalizarRevisaoAtividadeDissertativa,
  avaliarRespostasBanco,
};
