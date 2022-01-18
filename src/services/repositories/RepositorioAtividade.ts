import { v4 as uuid } from 'uuid';
import { Db, ClientSession } from 'mongodb';
import {
  Atividade,
  TipoAtividade,
  QuestaoAlternativa,
  QuestaoDissertativa,
} from '../../models';
import { DatabaseResult } from '../../structure/databaseResult';
import Database, { SearchType } from '../data/Database';

export const collection = 'Atividade';

export enum SituacaoAtividadeLeitura {
  aberta,
  fechada,
  todas,
}

const addAtividadeAlternativa = async (
  nome: string,
  idProjeto: string,
  idCurso: string,
  idMateria: string | null,
  aberturaRespostas: Date,
  fechamentoRespostas: Date,
  notaReferencia: number,
  questoes: QuestaoAlternativa[],
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<string>> => {
  const atividade: Atividade = {
    id: uuid(),
    nome: nome,
    criadoEm: new Date(),
    idProjeto: idProjeto,
    idCurso: idCurso,
    idMateria: idMateria,
    tipoAtividade: TipoAtividade.Alternativa,
    fechamentoRespostas: fechamentoRespostas,
    aberturaRespostas: aberturaRespostas,
    notaReferencia: notaReferencia,
    itens: questoes,
  };

  const add = await Database.addData<Atividade>(
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

const addAtividadeDissertativa = async (
  nome: string,
  idProjeto: string,
  idCurso: string,
  idMateria: string | null,
  aberturaRespostas: Date,
  fechamentoRespostas: Date,
  fechamentoCorrecoes: Date,
  notaReferencia: number,
  questoes: QuestaoDissertativa[],
  tempoColaboracao: number,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<string>> => {
  const atividade: Atividade = {
    id: uuid(),
    nome: nome,
    criadoEm: new Date(),
    idProjeto: idProjeto,
    idCurso: idCurso,
    idMateria: idMateria,
    tipoAtividade: TipoAtividade.Dissertativa,
    aberturaRespostas: aberturaRespostas,
    fechamentoRespostas: fechamentoRespostas,
    fechamentoCorrecoes: fechamentoCorrecoes,
    notaReferencia: notaReferencia,
    itens: questoes,
    tempoColaboracao: tempoColaboracao,
  };

  const add = await Database.addData<Atividade>(
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

const addAtividadeBancoDeQuestoes = async (
  nome: string,
  idProjeto: string,
  idCurso: string,
  idMateria: string | null,
  aberturaRespostas: Date,
  fechamentoRespostas: Date,
  assuntos: string[],
  tempoColaboracao: number,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<string>> => {
  const atividade: Atividade = {
    id: uuid(),
    nome: nome,
    criadoEm: new Date(),
    idProjeto: idProjeto,
    idCurso: idCurso,
    idMateria: idMateria,
    tipoAtividade: TipoAtividade.BancoDeQuestoes,
    aberturaRespostas: aberturaRespostas,
    fechamentoRespostas: fechamentoRespostas,
    assuntos: assuntos,
    tempoColaboracao: tempoColaboracao,
  };

  const add = await Database.addData<Atividade>(
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

const lerAtividade = async (
  id: string,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<Atividade>> => {
  return Database.readData<Atividade>(
    collection,
    [{ key: 'id', value: id }],
    db,
    session
  );
};

const lerAtividadesDissertativas = (
  situacao: SituacaoAtividadeLeitura | undefined,
  universitario: boolean,
  db: Db,
  session: ClientSession,
  additionalFilter?: {
    key: keyof Atividade;
    value: any;
  }
): Promise<DatabaseResult<Atividade[]>> => {
  const campoTipoAtividade: keyof Atividade = 'tipoAtividade';
  const campoFechamento: keyof (Atividade & {
    tipoAtividade: TipoAtividade.Dissertativa;
  }) = universitario ? 'fechamentoCorrecoes' : 'fechamentoRespostas';

  const searchFields: SearchType<Atividade>[] = [
    {
      key: campoTipoAtividade,
      value: TipoAtividade.Dissertativa,
    },
  ];

  if (additionalFilter !== undefined) {
    searchFields.push({
      key: additionalFilter.key,
      value: additionalFilter.value,
    });
  }

  if (situacao !== undefined) {
    if (situacao === SituacaoAtividadeLeitura.aberta) {
      searchFields.push({ key: campoFechamento, value: { $gt: new Date() } });
    } else if (situacao === SituacaoAtividadeLeitura.fechada) {
      searchFields.push({ key: campoFechamento, value: { $lt: new Date() } });
    }
  }

  return Database.readDatas<Atividade, Atividade>(
    collection,
    searchFields,
    db,
    session
  );
};

const lerAtividadesBancoDeQuestoes = (
  situacao: SituacaoAtividadeLeitura | undefined,
  db: Db,
  session: ClientSession,
  additionalFilter?: {
    key: keyof Atividade;
    value: any;
  }
): Promise<DatabaseResult<Atividade[]>> => {
  const campoTipoAtividade: keyof Atividade = 'tipoAtividade';
  const campoFechamento: keyof Atividade = 'fechamentoRespostas';

  const searchFields: SearchType<Atividade>[] = [
    {
      key: campoTipoAtividade,
      value: TipoAtividade.BancoDeQuestoes,
    },
  ];

  if (additionalFilter !== undefined) {
    searchFields.push({
      key: additionalFilter.key,
      value: additionalFilter.value,
    });
  }

  if (situacao !== undefined) {
    if (situacao === SituacaoAtividadeLeitura.aberta) {
      searchFields.push({ key: campoFechamento, value: { $gt: new Date() } });
    } else if (situacao === SituacaoAtividadeLeitura.fechada) {
      searchFields.push({ key: campoFechamento, value: { $lt: new Date() } });
    }
  }

  return Database.readDatas<Atividade, Atividade>(
    collection,
    searchFields,
    db,
    session
  );
};

const lerAtividadesAlternativas = (
  situacao: SituacaoAtividadeLeitura | undefined,
  db: Db,
  session: ClientSession,
  additionalFilter?: {
    key: keyof Atividade;
    value: any;
  }
): Promise<DatabaseResult<Atividade[]>> => {
  const campoTipoAtividade: keyof Atividade = 'tipoAtividade';
  const campoFechamento: keyof Atividade = 'fechamentoRespostas';

  const searchFields: SearchType<Atividade>[] = [
    {
      key: campoTipoAtividade,
      value: TipoAtividade.Alternativa,
    },
  ];

  if (additionalFilter !== undefined) {
    searchFields.push({
      key: additionalFilter.key,
      value: additionalFilter.value,
    });
  }

  if (situacao !== undefined) {
    if (situacao === SituacaoAtividadeLeitura.aberta) {
      searchFields.push({ key: campoFechamento, value: { $gt: new Date() } });
    } else if (situacao === SituacaoAtividadeLeitura.fechada) {
      searchFields.push({ key: campoFechamento, value: { $lt: new Date() } });
    }
  }

  return Database.readDatas<Atividade, Atividade>(
    collection,
    searchFields,
    db,
    session
  );
};

const lerAtividadesEspecificas = async (
  key: 'idMateria' | 'idCurso' | 'idProjeto',
  value: any,
  situacao: SituacaoAtividadeLeitura | undefined,
  aluno: boolean,
  universitario: boolean,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<Atividade[]>> => {
  let atividades: Atividade[] = [];

  if (!universitario) {
    const leituraAtividadesAlternativas = await lerAtividadesAlternativas(
      situacao,
      db,
      session,
      { key: key, value: value }
    );
    if (!leituraAtividadesAlternativas.success) {
      return leituraAtividadesAlternativas;
    }

    atividades = [...atividades, ...leituraAtividadesAlternativas.data];
  }

  if (!aluno) {
    const leituraAtividadesBancoDeQuestoes = await lerAtividadesBancoDeQuestoes(
      situacao,
      db,
      session,
      { key: key, value: value }
    );

    if (!leituraAtividadesBancoDeQuestoes.success) {
      return leituraAtividadesBancoDeQuestoes;
    }

    atividades = [...atividades, ...leituraAtividadesBancoDeQuestoes.data];
  }

  const leituraAtividadesDisserativas = await lerAtividadesDissertativas(
    situacao,
    universitario,
    db,
    session,
    {
      key: key,
      value: value,
    }
  );

  if (!leituraAtividadesDisserativas.success) {
    return leituraAtividadesDisserativas;
  }

  atividades = [...atividades, ...leituraAtividadesDisserativas.data];

  return {
    success: true,
    data: atividades,
  };
};

const removerAtividade = async (
  id: string,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<null>> => {
  const campoId: keyof Atividade = 'id';

  return Database.remove<Atividade>(
    collection,
    [{ key: campoId, value: id }],
    db,
    session
  );
};

export default {
  addAtividadeAlternativa,
  addAtividadeDissertativa,
  addAtividadeBancoDeQuestoes,
  lerAtividade,
  lerAtividadesEspecificas,
  removerAtividade,
};
