import { v4 as uuid } from 'uuid';
import { Db, ClientSession } from 'mongodb';
import { CursoUniversitario } from '../../models';
import { DatabaseResult } from '../../structure/databaseResult';
import Database from '../data/Database';

const collection = 'CursoUniversitario';

type CursoUniversitarioBanco = Omit<CursoUniversitario, 'cursoAnterior'> & {
  cursoAnterior?: { id: string };
};

const addCursoUniversitario = async (
  curso: Omit<CursoUniversitario, 'id'>,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<CursoUniversitario>> => {
  const _curso: CursoUniversitarioBanco = {
    id: uuid(),
    ...curso,
    cursoAnterior:
      curso.cursoAnterior !== undefined
        ? {
            id: curso.cursoAnterior.id,
          }
        : undefined,
  };

  const addResult = await Database.addData<CursoUniversitarioBanco>(
    collection,
    _curso,
    db,
    session
  );
  if (!addResult.success) return addResult;

  return {
    success: true,
    data: {
      ..._curso,
      cursoAnterior: curso.cursoAnterior,
    },
  };
};

const readCursoUniversitario = async (
  id: string,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<CursoUniversitario>> => {
  const readCurso = await Database.readData<CursoUniversitarioBanco>(
    collection,
    [{ key: 'id', value: id }],
    db,
    session
  );

  if (!readCurso.success) return readCurso;

  const _curso = readCurso.data;
  if (_curso.cursoAnterior !== undefined) {
    const readCursoAnterior = await readCursoUniversitario(
      _curso.cursoAnterior.id,
      db,
      session
    );
    if (!readCursoAnterior.success) {
      return {
        success: true,
        data: {
          ..._curso,
          cursoAnterior: undefined,
        },
      };
    }

    return {
      success: true,
      data: {
        ..._curso,
        cursoAnterior: readCursoAnterior.data,
      },
    };
  }

  return {
    success: true,
    data: {
      ..._curso,
      cursoAnterior: undefined,
    },
  };
};

const readCursosUniversitarios = async (
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<CursoUniversitario[]>> => {
  const resultDatabase = await Database.readDatas<
    CursoUniversitarioBanco,
    CursoUniversitarioBanco
  >(collection, [], db, session);
  if (!resultDatabase.success) return resultDatabase;

  const cursosBanco = resultDatabase.data;
  let mapaCursosBanco: { [idCurso: string]: CursoUniversitarioBanco } = {};
  cursosBanco.forEach((curso) => {
    mapaCursosBanco = {
      ...mapaCursosBanco,
      [curso.id]: curso,
    };
  });

  const montarCurso = (curso: CursoUniversitarioBanco): CursoUniversitario => {
    if (curso.cursoAnterior === undefined)
      return {
        ...curso,
        cursoAnterior: undefined,
      };
    else {
      const cursoAnterior = mapaCursosBanco[curso.cursoAnterior.id];
      return {
        ...curso,
        cursoAnterior:
          cursoAnterior !== undefined ? montarCurso(cursoAnterior) : undefined,
      };
    }
  };

  return {
    success: true,
    data: cursosBanco.map(montarCurso),
  };
};

const updateCursoUniversitario = (
  id: string,
  curso: Partial<Omit<CursoUniversitario, 'id'>>,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<null>> => {
  return Database.updatePartialData<CursoUniversitarioBanco>(
    collection,
    [{ key: 'id', value: id }],
    {
      ...curso,
      cursoAnterior:
        curso.cursoAnterior !== undefined
          ? {
              id: curso.cursoAnterior.id,
            }
          : undefined,
    },
    db,
    session
  );
};

const deleteCursoUniversitario = (
  id: string,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<null>> => {
  return Database.remove<CursoUniversitarioBanco>(
    collection,
    [{ key: 'id', value: id }],
    db,
    session
  );
};

export default {
  addCursoUniversitario,
  readCursoUniversitario,
  readCursosUniversitarios,
  updateCursoUniversitario,
  deleteCursoUniversitario,
};
