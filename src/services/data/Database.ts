import { ClientSession, Db, FindCursor, Document } from 'mongodb';
import { DatabaseResult } from '../../structure/databaseResult';

const removeEmptyObjects = <T>(array: any[]): T[] => {
  const list: T[] = [];

  array.forEach((value) => {
    if (Object.keys(value).length !== 0) {
      list.push(value as T);
    }
  });

  return list;
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
  data: Partial<T> & { id: string },
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<null>> => {
  try {
    await db
      .collection(collection)
      .updateOne({ id: data.id }, { $set: data }, { session });
    return { success: true, data: null };
  } catch (e) {
    return {
      success: false,
      error: e as Error,
    };
  }
};

const updatePushData = async <T>(
  collection: string,
  id: string,
  data: T,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<null>> => {
  try {
    await db
      .collection(collection)
      .updateOne({ id: id }, { $push: data }, { session });
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
  keyField: keyof T,
  field: any,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<T>> => {
  try {
    const response = await db
      .collection(collection)
      .find({ [keyField]: field }, { session: session })
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
  condictions: { key: keyof T | string; value: any }[],
  db: Db,
  session: ClientSession,
  fields?: (keyof T | string)[]
): Promise<DatabaseResult<M[]>> => {
  try {
    const search: { [key: string]: any } = {};

    condictions.forEach((config) => {
      const { key, value } = config;
      search[key as string] = value;
    });

    const responseFields: { [key: string]: number } = {};

    if (fields !== undefined) {
      responseFields['_id'] = 0;
      fields.forEach((key) => {
        responseFields[key as string] = 1;
      });
    }

    const response = await db
      .collection(collection)
      .find(search, { projection: responseFields, session: session })
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
  keyField: keyof T,
  field: any,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<null>> => {
  try {
    const response = await db
      .collection(collection)
      .findOneAndDelete({ [keyField]: field }, { session });

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
