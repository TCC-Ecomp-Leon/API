import { ClientSession, Db } from 'mongodb';
import { DatabaseResult } from '../../structure/databaseResult';

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
  data: T,
  keyField: keyof T,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<null>> => {
  try {
    await db.collection(collection).findOneAndUpdate(
      {
        [keyField]: data[keyField],
      },
      data,
      { session: session }
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
  keyField: keyof T,
  field: any,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<T>> => {
  try {
    const response = await db
      .collection(collection)
      .find({ [keyField]: field }, { session })
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

const readDatas = async <T>(
  collection: string,
  keyField: keyof T,
  field: any,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<Array<T>>> => {
  try {
    const response = await db
      .collection(collection)
      .find({ [keyField]: field }, { session })
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
  remove,
};
