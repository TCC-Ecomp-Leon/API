import { ClientSession, Db, FindCursor, Document } from 'mongodb';
import { DatabaseResult } from '../../structure/databaseResult';

export type SearchType<T> = { key: keyof T | string; value: any };

const removeEmptyObjects = <T>(array: any[]): T[] => {
  const list: T[] = [];

  array.forEach((value) => {
    if (Object.keys(value).length !== 0) {
      list.push(value as T);
    }
  });

  return list;
};

const getSearchValues = <T>(searchParameters: SearchType<T>[]): object => {
  let search: object = {};

  if (searchParameters.length === 0) {
    throw Error("Can't use a query service without search parameters");
  }
  for (let i = 0; i < searchParameters.length; i++) {
    const { key, value } = searchParameters[i];
    search = { ...search, [key]: value };
  }
  return search;
};

const addData = async <T>(
  collection: string,
  data: T,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<null>> => {
  try {
    await db.collection(collection).insertOne(data, { session });
    return { success: true, data: null };
  } catch (e) {
    return {
      success: false,
      error: e as Error,
    };
  }
};

const updateData = async <T>(
  collection: string,
  searchParameters: SearchType<T>[],
  data: Partial<T>,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<null>> => {
  try {
    await db
      .collection(collection)
      .updateOne(
        getSearchValues(searchParameters),
        { $set: data },
        { session }
      );
    return { success: true, data: null };
  } catch (e) {
    return {
      success: false,
      error: e as Error,
    };
  }
};

const updatePushData = async <T, M>(
  collection: string,
  searchParameters: SearchType<T>[],
  keyField: keyof T | string,
  data: M,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<null>> => {
  try {
    const result = await db
      .collection(collection)
      .updateOne(
        getSearchValues(searchParameters),
        { $push: { [keyField]: data } },
        { session }
      );
    return { success: true, data: null };
  } catch (e) {
    return {
      success: false,
      error: e as Error,
    };
  }
};

const readData = async <T>(
  collection: string,
  searchParameters: SearchType<T>[],
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<T>> => {
  try {
    const response = await db
      .collection(collection)
      .find(getSearchValues(searchParameters), { session: session })
      .toArray();

    if (response.length === 0) {
      return {
        success: false,
        error: Error('Not found'),
      };
    }

    return {
      success: true,
      data: response[0] as T,
    };
  } catch (e) {
    return {
      success: false,
      error: e as Error,
    };
  }
};

const readDatas = async <T, M>(
  collection: string,
  searchParameters: SearchType<T>[],
  db: Db,
  session: ClientSession,
  fields?: (keyof T | string)[]
): Promise<DatabaseResult<M[]>> => {
  try {
    const responseFields: { [key: string]: number } = {};

    if (fields !== undefined) {
      responseFields['_id'] = 0;
      fields.forEach((key) => {
        responseFields[key as string] = 1;
      });
    }

    const response = await db
      .collection(collection)
      .find(getSearchValues(searchParameters), {
        projection: responseFields,
        session: session,
      })
      .toArray();
    return {
      success: true,
      data: removeEmptyObjects<M>(response),
    };
  } catch (e) {
    return {
      success: false,
      error: e as Error,
    };
  }
};

const readCollection = async <T>(
  collection: string,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<Array<T>>> => {
  try {
    const response = await db
      .collection(collection)
      .find({}, { session })
      .toArray();

    return {
      success: true,
      data: response.map((data) => data as T),
    };
  } catch (e) {
    return {
      success: false,
      error: e as Error,
    };
  }
};

const remove = async <T>(
  collection: string,
  searchParameters: SearchType<T>[],
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<null>> => {
  try {
    const response = await db
      .collection(collection)
      .findOneAndDelete(getSearchValues(searchParameters), { session });

    return {
      success: true,
      data: null,
    };
  } catch (e) {
    return {
      success: false,
      error: e as Error,
    };
  }
};

export default {
  addData,
  readData,
  readDatas,
  readCollection,
  updateData,
  updatePushData,
  remove,
};
