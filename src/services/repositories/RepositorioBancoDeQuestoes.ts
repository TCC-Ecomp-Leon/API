import { v4 as uuid } from 'uuid';
import { Db, ClientSession } from 'mongodb';
import {
  Atividade,
  BancoDeQuestoes,
  QuestaoBancoDeQuestoes,
  TipoAtividade,
} from '../../models';
import { DatabaseResult } from '../../structure/databaseResult';
import Database, { SearchType } from '../data/Database';
import RepositorioAtividade from './RepositorioAtividade';

const collection = 'BancoDeQuestoes';

const adicionarQuestao = async (
  atividade: Atividade & { tipoAtividade: TipoAtividade.BancoDeQuestoes },
  questao: QuestaoBancoDeQuestoes,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<string>> => {
  const banco: BancoDeQuestoes = {
    id: uuid(),
    criadoEm: new Date(),
    idProjeto: atividade.idProjeto,
    idCurso: atividade.idCurso,
    idMateria: atividade.idMateria,
    questao: questao,
    assuntos: atividade.assuntos,
  };

  const add = await Database.addData<BancoDeQuestoes>(
    collection,
    banco,
    db,
    session
  );
  if (!add.success) return add;

  return {
    success: true,
    data: banco.id,
  };
};

const lerQuestoes = (
  idCurso: string,
  idMateria: string | undefined,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<BancoDeQuestoes[]>> => {
  const campoCurso: keyof BancoDeQuestoes = 'idCurso';
  const campoMateria: keyof BancoDeQuestoes = 'idMateria';

  const searchParams: SearchType<BancoDeQuestoes>[] = [
    { key: campoCurso, value: idCurso },
  ];
  if (idMateria !== undefined) {
    searchParams.push({ key: campoMateria, value: idMateria });
  }

  return Database.readDatas<BancoDeQuestoes, BancoDeQuestoes>(
    collection,
    searchParams,
    db,
    session
  );
};

const lerQuestao = (
  id: string,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<BancoDeQuestoes>> => {
  const campoId: keyof BancoDeQuestoes = 'id';

  return Database.readData<BancoDeQuestoes>(
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
};

const removerQuestao = (
  id: string,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<null>> => {
  return Database.remove<BancoDeQuestoes>(
    collection,
    [{ key: 'id', value: id }],
    db,
    session
  );
};

const atualizarQuestao = (
  id: string,
  questao: QuestaoBancoDeQuestoes,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<null>> => {
  return Database.updatePartialData<BancoDeQuestoes>(
    collection,
    [{ key: 'id', value: id }],
    { questao: questao },
    db,
    session
  );
};

const lerQuestoesComFiltro = (
  filtros: SearchType<BancoDeQuestoes>[],
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<BancoDeQuestoes[]>> => {
  return Database.readDatas<BancoDeQuestoes, BancoDeQuestoes>(
    collection,
    filtros,
    db,
    session
  );
};

export default {
  adicionarQuestao,
  lerQuestao,
  lerQuestoes,
  atualizarQuestao,
  removerQuestao,
  lerQuestoesComFiltro,
};
