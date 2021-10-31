import {
  DatabaseService,
  withDatabaseTransaction,
} from '../../config/database';
import dummyService from '../../services/data/dummyService';
import Context from '../../structure/context';
import Handler from '../../structure/handler';
import { NavigationResult } from '../../structure/navigation';

type Body = { message: string; data: Array<any> };

export const dummyGetHandler = new Handler(
  async (context: Context): Promise<NavigationResult<Body>> => {
    const data = { message: 'test', time: new Date() };
    const service: DatabaseService<NavigationResult<Body>> = async (
      db,
      session
    ) => {
      const addResult = await dummyService.addDymmyData(data, db, session);
      if (!addResult.success) {
        throw addResult.error;
      }

      const readResult = await dummyService.readDummyDatas(db, session);
      if (!readResult.success) {
        throw readResult.error;
      }

      const updateResult = await dummyService.updateDummyData(
        data.time,
        { message: 'updated' },
        db,
        session
      );
      if (!updateResult.success) {
        throw updateResult.error;
      }

      return {
        status: 200,
        body: { message: 'Success', data: readResult.data },
      };
    };

    return await withDatabaseTransaction(service);
  }
);
