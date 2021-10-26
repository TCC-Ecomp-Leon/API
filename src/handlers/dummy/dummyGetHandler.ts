import { ClientSession } from 'mongoose';
import {
  addDymmyData,
  readDummyDatas,
  updateDummyData,
} from '../../services/data/dummyService';
import Context from '../../structure/context';
import Handler from '../../structure/handler';
import { NavigationResult } from '../../structure/navigation';

export const dummyGetHandler = new Handler(
  async (
    context: Context,
    session: ClientSession
  ): Promise<NavigationResult<{ message: string; data: Array<any> }>> => {
    const data = { message: 'test', time: new Date() };
    const addResult = await addDymmyData(data, session);
    if (!addResult.success) {
      throw addResult.error;
    }

    const readResult = await readDummyDatas(session);
    if (!readResult.success) {
      throw readResult.error;
    }

    const updateResult = await updateDummyData(
      data.time,
      { message: 'updated' },
      session
    );
    if (!updateResult.success) {
      throw updateResult.error;
    }

    return {
      databaseSuccess: true,
      result: {
        status: 200,
        body: { message: 'Success', data: readResult.data },
      },
    };
  }
);
