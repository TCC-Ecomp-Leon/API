import { ClientSession, model, Schema, Document, Model } from 'mongoose';
import { DatabaseResult } from '../../structure/databaseResult';

const collection: string = 'Dummy';

const DummySchema = new Schema({
  message: String,
  time: Date,
});

type IDummy = {
  message: string;
  time: Date;
};

interface IDummyDocument extends IDummy, Document {}
interface IDummyModel extends Model<IDummyDocument> {}

const DummyModel = model<IDummyModel>(collection, DummySchema, collection);

function castDbData(data: IDummyModel): IDummy {
  const castData = data as any as IDummyDocument;
  return {
    message: castData.message,
    time: castData.time,
  };
}

export const addDymmyData = async (
  data: IDummy,
  session: ClientSession
): Promise<DatabaseResult<null>> => {
  try {
    const store = new DummyModel(data);
    const response = await store.save({ session: session });
    if (response.errors !== undefined) {
      throw response.errors;
    }
    return { success: true, data: null };
  } catch (e) {
    return {
      success: false,
      error: e as Error,
    };
  }
};

export const readDummyDatas = async (
  session: ClientSession
): Promise<DatabaseResult<Array<IDummy>>> => {
  try {
    const response = await DummyModel.find().session(session);

    return {
      success: true,
      data: response.map((data) => castDbData(data)),
    };
  } catch (e) {
    return {
      success: false,
      error: e as Error,
    };
  }
};

export const updateDummyData = async (
  time: Date,
  data: Partial<IDummy>,
  session: ClientSession
): Promise<DatabaseResult<null>> => {
  try {
    const response = await DummyModel.findOneAndUpdate(
      { time: time },
      data
    ).session(session);
    if (response !== null && response.errors !== undefined) {
      throw response.errors;
    }

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
