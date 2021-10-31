import dummyService from './dummyService';
import {
  DatabaseService,
  withDatabaseTransaction,
} from '../../config/database';

jest.setTimeout(10000);

let dummyDataAmount: number | undefined = undefined;

test('try to insert a dummy data, read the dummy datas and rollback this', async () => {
  const test = <T>(computeFirstReadLength?: (value: number) => void) => {
    const service: DatabaseService<void> = async (db, session) => {
      const dummyData = { message: 'test', time: new Date() };

      const readBeforeInsertion = await dummyService.readDummyDatas(
        db,
        session
      );
      expect(readBeforeInsertion.success).toBe(true);

      if (!readBeforeInsertion.success) throw readBeforeInsertion.error;

      if (computeFirstReadLength !== undefined) {
        computeFirstReadLength(readBeforeInsertion.data.length);
      }

      const addResult = await dummyService.addDymmyData(dummyData, db, session);
      expect(addResult.success).toBe(true);

      const readAfterInsertion = await dummyService.readDummyDatas(db, session);
      expect(
        readAfterInsertion.success &&
          readAfterInsertion.data.length - readBeforeInsertion.data.length === 1
      ).toBe(true);
    };
    return service;
  };

  let readBeforeInsertionAmount: number | undefined = undefined;
  await withDatabaseTransaction(
    test((value) => {
      readBeforeInsertionAmount = value;
    }),
    undefined,
    true
  );

  await withDatabaseTransaction(
    test((value) => {
      expect(value === readBeforeInsertionAmount).toBe(true);
    }),
    undefined,
    true
  );
});
