import { v4 as uuid } from 'uuid';
import { Db, ClientSession } from 'mongodb';
import { Atividade, TipoAtividade } from 'tcc-models';
import { DatabaseResult } from '../../structure/databaseResult';
import Database, { SearchType } from '../data/Database';
import {
  QuestaoAlternativa,
  QuestaoDissertativa,
} from 'tcc-models/src/Atividade';

const collection = 'Atividade';

export enum SituacaoAtividadeLeitura {
  aberta,
  fechada,
  todas,
}

const addAtividadeAlternativa = async (
  nome: string,
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

const lerAtividadesCurso = async (
  idCurso: string,
  situacao: SituacaoAtividadeLeitura = SituacaoAtividadeLeitura.aberta,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<Atividade[]>> => {
  const campoCurso: keyof Atividade = 'idCurso';
  const campoFechamento = 'fechamentoRespostas';

  const searchFields: SearchType<Atividade>[] = [
    { key: campoCurso, value: idCurso },
  ];

  if (situacao === SituacaoAtividadeLeitura.aberta) {
    searchFields.push({ key: campoFechamento, value: { $gt: new Date() } });
  } else if (situacao === SituacaoAtividadeLeitura.fechada) {
    searchFields.push({ key: campoFechamento, value: { $lt: new Date() } });
  }

  return Database.readDatas<Atividade, Atividade>(
    collection,
    searchFields,
    db,
    session
  );
};

const lerAtividadesMateria = (
  idMateria: string,
  situacao: SituacaoAtividadeLeitura = SituacaoAtividadeLeitura.aberta,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<Atividade[]>> => {
  const campoMateria: keyof Atividade = 'idMateria';
  const campoFechamento = 'fechamentoRespostas';

  const searchFields: SearchType<Atividade>[] = [
    { key: campoMateria, value: idMateria },
  ];

  if (situacao === SituacaoAtividadeLeitura.aberta) {
    searchFields.push({ key: campoFechamento, value: { $gt: new Date() } });
  } else if (situacao === SituacaoAtividadeLeitura.fechada) {
    searchFields.push({ key: campoFechamento, value: { $lt: new Date() } });
  }

  return Database.readDatas<Atividade, Atividade>(
    collection,
    searchFields,
    db,
    session
  );
};

const lerAtividadesBancoDeQuestoes = (
  situacao: SituacaoAtividadeLeitura = SituacaoAtividadeLeitura.aberta,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<Atividade[]>> => {
  const campoTipo: keyof Atividade = 'tipoAtividade';
  const campoFechamento = 'fechamentoRespostas';

  const searchFields: SearchType<Atividade>[] = [
    { key: campoTipo, value: TipoAtividade.BancoDeQuestoes },
  ];

  if (situacao === SituacaoAtividadeLeitura.aberta) {
    searchFields.push({ key: campoFechamento, value: { $gt: new Date() } });
  } else if (situacao === SituacaoAtividadeLeitura.fechada) {
    searchFields.push({ key: campoFechamento, value: { $lt: new Date() } });
  }

  return Database.readDatas<Atividade, Atividade>(
    collection,
    searchFields,
    db,
    session
  );
};

export default {
  addAtividadeAlternativa,
  addAtividadeDissertativa,
  addAtividadeBancoDeQuestoes,
  lerAtividade,
  lerAtividadesCurso,
  lerAtividadesMateria,
  lerAtividadesBancoDeQuestoes,
};
