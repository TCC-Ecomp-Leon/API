import { v4 as uuid } from 'uuid';
import { Db, ClientSession } from 'mongodb';
import {
  EstadoRevisao,
  RespostaAtividade,
  RespostaAlternativa,
  RespostaDissertativa,
  CorrecaoDissertativa,
  QuestaoBancoDeQuestoes,
  Atividade,
  TipoAtividade,
  QuestaoAlternativa,
  AvaliacaoRespostaBancoDeQuestoes,
} from '../../models';
import { DatabaseResult } from '../../structure/databaseResult';
import Database from '../data/Database';
import _ from 'lodash';

import RepositorioBancoDeQuestoes from './RepositorioBancoDeQuestoes';
import RepositorioAtividade from './RepositorioAtividade';

const collection = 'RespostaAtividade';

const responderAtividadeAlternativa = async (
  idProjeto: string,
  idCurso: string | null,
  idMateria: string | null,
  idAtividade: string,
  idAluno: string,
  respostas: RespostaAlternativa[],
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<string>> => {
  const resposta: RespostaAtividade = {
    id: uuid(),
    idProjeto: idProjeto,
    idCurso: idCurso,
    idMateria: idMateria,
    idAtividade: idAtividade,
    tipo: TipoAtividade.Alternativa,
    respostas: respostas,
    idAluno: idAluno,
    respondidoEm: new Date(),
    encerrada: false,
  };

  const result = await Database.addData<RespostaAtividade>(
    collection,
    resposta,
    db,
    session
  );

  if (!result.success) return result;

  return {
    success: true,
    data: resposta.id,
  };
};

const responderAtividadeDissertativa = async (
  idProjeto: string,
  idCurso: string | null,
  idMateria: string | null,
  idAtividade: string,
  idAluno: string,
  respostas: RespostaDissertativa[],
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<string>> => {
  const resposta: RespostaAtividade = {
    id: uuid(),
    idProjeto: idProjeto,
    idCurso: idCurso,
    idMateria: idMateria,
    idAtividade: idAtividade,
    tipo: TipoAtividade.Dissertativa,
    respostas: respostas,
    idAluno: idAluno,
    respondidoEm: new Date(),
    corrigida: false,
  };

  const result = await Database.addData<RespostaAtividade>(
    collection,
    resposta,
    db,
    session
  );

  if (!result.success) return result;

  return {
    success: true,
    data: resposta.id,
  };
};

const responderAtividadeBancoDeQuestoes = async (
  idProjeto: string,
  idCurso: string | null,
  idMateria: string | null,
  idAtividade: string,
  idUniversitario: string,
  respostas: QuestaoBancoDeQuestoes[],
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<string>> => {
  const resposta: RespostaAtividade = {
    id: uuid(),
    idProjeto: idProjeto,
    idCurso: idCurso,
    idMateria: idMateria,
    idAtividade: idAtividade,
    tipo: TipoAtividade.BancoDeQuestoes,
    respostas: respostas,
    idUniversitario: idUniversitario,
    respondidoEm: new Date(),
    avaliada: false,
  };

  const result = await Database.addData<RespostaAtividade>(
    collection,
    resposta,
    db,
    session
  );

  if (!result.success) return result;

  return {
    success: true,
    data: resposta.id,
  };
};

const completarAtividadeAlternativa = (
  resposta: RespostaAtividade & { tipo: TipoAtividade.Alternativa },
  atividade: Atividade & { tipoAtividade: TipoAtividade.Alternativa }
): RespostaAtividade & { tipo: TipoAtividade.Alternativa } => {
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
      ...resposta,
      encerrada: true,
      nota: nota,
    };
  } else {
    return {
      ...resposta,
      encerrada: false,
    };
  }
};

const lerResposta = async (
  id: string,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<RespostaAtividade>> => {
  const campoId: keyof RespostaAtividade = 'id';
  const leitura = await Database.readData<RespostaAtividade>(
    collection,
    [
      {
        key: campoId,
        value: id,
      },
    ],
    db,
    session
  );

  if (!leitura.success) return leitura;

  const dado = leitura.data;
  if (dado.tipo === TipoAtividade.Alternativa) {
    const leituraAtividade = await RepositorioAtividade.lerAtividade(
      dado.idAtividade,
      db,
      session
    );

    if (!leituraAtividade.success) return leituraAtividade;

    const atividade = leituraAtividade.data;
    if (atividade.tipoAtividade !== TipoAtividade.Alternativa) {
      return {
        success: false,
        error: Error('Resposta alternativa de atividade não alternativa'),
      };
    }

    return {
      success: true,
      data: completarAtividadeAlternativa(dado, atividade),
    };
  } else {
    return {
      success: true,
      data: dado,
    };
  }
};

const lerRespostas = async (
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<RespostaAtividade[]>> => {
  const leitura = await Database.readCollection<RespostaAtividade>(
    collection,
    db,
    session
  );

  if (!leitura.success) return leitura;

  const dados = leitura.data;
  const lista: RespostaAtividade[] = [];

  for (let i = 0; i < dados.length; i++) {
    const dado = dados[i];

    if (dado.tipo === TipoAtividade.Alternativa) {
      const leituraAtividade = await RepositorioAtividade.lerAtividade(
        dado.idAtividade,
        db,
        session
      );

      if (!leituraAtividade.success) return leituraAtividade;

      const atividade = leituraAtividade.data;
      if (atividade.tipoAtividade !== TipoAtividade.Alternativa) {
        return {
          success: false,
          error: Error('Resposta alternativa de atividade não alternativa'),
        };
      }

      lista.push(completarAtividadeAlternativa(dado, atividade));
    } else {
      lista.push(dado);
    }
  }

  return {
    success: true,
    data: lista,
  };
};

const lerRespostasEspecificas = async (
  key: keyof RespostaAtividade,
  value: any,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<RespostaAtividade[]>> => {
  const leitura = await Database.readDatas<
    RespostaAtividade,
    RespostaAtividade
  >(
    collection,
    [
      {
        key: key,
        value: value,
      },
    ],
    db,
    session
  );

  if (!leitura.success) return leitura;

  const dados = leitura.data;
  const lista: RespostaAtividade[] = [];

  for (let i = 0; i < dados.length; i++) {
    const dado = dados[i];

    if (dado.tipo === TipoAtividade.Alternativa) {
      const leituraAtividade = await RepositorioAtividade.lerAtividade(
        dado.idAtividade,
        db,
        session
      );

      if (!leituraAtividade.success) return leituraAtividade;

      const atividade = leituraAtividade.data;
      if (atividade.tipoAtividade !== TipoAtividade.Alternativa) {
        return {
          success: false,
          error: Error('Resposta alternativa de atividade não alternativa'),
        };
      }

      lista.push(completarAtividadeAlternativa(dado, atividade));
    } else {
      lista.push(dado);
    }
  }

  return {
    success: true,
    data: lista,
  };
};

const corrigirAtividadeDissertativa = (
  id: string,
  idPerfil: string,
  nota: number,
  correcaoQuestoes: CorrecaoDissertativa[],
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<null>> => {
  const campoId: keyof RespostaAtividade = 'id';
  const atualizacao: Partial<RespostaAtividade> & {
    tipo: TipoAtividade.Dissertativa;
  } = {
    tipo: TipoAtividade.Dissertativa,
    corrigida: true,
    horarioCorrecao: new Date(),
    idPerfilCorrecao: idPerfil,
    nota: nota,
    correcaoQuestao: correcaoQuestoes,
    revisao: EstadoRevisao.Nenhum,
  };

  return Database.updatePartialData<RespostaAtividade>(
    collection,
    [
      {
        key: campoId,
        value: id,
      },
    ],
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
  const campoId: keyof RespostaAtividade = 'id';
  const atualizacao: Partial<RespostaAtividade> & {
    tipo: TipoAtividade.Dissertativa;
  } = {
    tipo: TipoAtividade.Dissertativa,
    revisao: EstadoRevisao.Requisitada,
    revisaoRequisitadaEm: new Date(),
  };

  return Database.updatePartialData<RespostaAtividade>(
    collection,
    [
      {
        key: campoId,
        value: id,
      },
    ],
    atualizacao,
    db,
    session
  );
};

const finalizarRevisaoAtividadeDissertativa = async (
  id: string,
  nota: number,
  correcaoQuestoes: CorrecaoDissertativa[],
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<null>> => {
  const leituraRespostaAnterior = await lerResposta(id, db, session);
  if (!leituraRespostaAnterior.success) return leituraRespostaAnterior;

  const respostaAnterior = leituraRespostaAnterior.data;
  if (respostaAnterior.tipo !== TipoAtividade.Dissertativa) {
    return {
      success: false,
      error: Error(
        'Tentando finalizar a revisão de uma atividade não dissertativa'
      ),
    };
  }
  if (!respostaAnterior.corrigida) {
    return {
      success: false,
      error: Error(
        'Tentando finalizar a revisão de uma atividade ainda não corrigida'
      ),
    };
  }

  const campoId: keyof RespostaAtividade = 'id';
  const atualizacao: Partial<RespostaAtividade> & {
    tipo: TipoAtividade.Dissertativa;
  } = {
    tipo: TipoAtividade.Dissertativa,
    nota: nota,
    revisao: EstadoRevisao.Finalizada,
    revisaoAtendidaEm: new Date(),
    revisaoQuestoes: correcaoQuestoes,
    notaRevisao: nota,
    notaAnteriorRevisao: respostaAnterior.nota,
  };

  return Database.updatePartialData<RespostaAtividade>(
    collection,
    [
      {
        key: campoId,
        value: id,
      },
    ],
    atualizacao,
    db,
    session
  );
};

const avaliarRespostasBanco = async (
  id: string,
  idPerfil: string,
  avaliacoes: AvaliacaoRespostaBancoDeQuestoes,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<null>> => {
  const campoId: keyof RespostaAtividade = 'id';

  const leituraResposta = await lerResposta(id, db, session);
  if (!leituraResposta.success) return leituraResposta;

  let resposta = leituraResposta.data;
  if (resposta.tipo !== TipoAtividade.BancoDeQuestoes) {
    return {
      success: false,
      error: Error(
        'Tentando avaliar questões de banco de questão que não são desse tipo'
      ),
    };
  }

  const readAtividade = await RepositorioAtividade.lerAtividade(
    resposta.idAtividade,
    db,
    session
  );
  if (!readAtividade.success) return readAtividade;
  const atividade = readAtividade.data;
  if (atividade.tipoAtividade !== TipoAtividade.BancoDeQuestoes) {
    return {
      success: false,
      error: Error(
        'Avaliação de resposta de banco de questẽos de atividade que não é desse tipo'
      ),
    };
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
    avaliadaPor: idPerfil,
    ...avaliacoes,
  };

  const atualizacaoResposta =
    await Database.updatePartialData<RespostaAtividade>(
      collection,
      [{ key: campoId, value: id }],
      resposta,
      db,
      session
    );

  if (!atualizacaoResposta.success) return atualizacaoResposta;

  for (let i = 0; i < questoesBanco.length; i++) {
    const questao = questoesBanco[i];

    const add = await RepositorioBancoDeQuestoes.adicionarQuestao(
      atividade,
      questao,
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
  lerRespostas,
  lerRespostasEspecificas,
  corrigirAtividadeDissertativa,
  requisitarRevisaoAtividadeDissertativa,
  finalizarRevisaoAtividadeDissertativa,
  avaliarRespostasBanco,
};
