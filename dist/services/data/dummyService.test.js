"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dummyService_1 = __importDefault(require("./dummyService"));
const database_1 = require("../../config/database");
jest.setTimeout(10000);
let dummyDataAmount = undefined;
test('try to insert a dummy data, read the dummy datas and rollback this', async () => {
    const test = (computeFirstReadLength) => {
        const service = async (db, session) => {
            const dummyData = { message: 'test', time: new Date() };
            const readBeforeInsertion = await dummyService_1.default.readDummyDatas(db, session);
            expect(readBeforeInsertion.success).toBe(true);
            if (!readBeforeInsertion.success)
                throw readBeforeInsertion.error;
            if (computeFirstReadLength !== undefined) {
                computeFirstReadLength(readBeforeInsertion.data.length);
            }
            const addResult = await dummyService_1.default.addDymmyData(dummyData, db, session);
            expect(addResult.success).toBe(true);
            const readAfterInsertion = await dummyService_1.default.readDummyDatas(db, session);
            expect(readAfterInsertion.success &&
                readAfterInsertion.data.length - readBeforeInsertion.data.length === 1).toBe(true);
        };
        return service;
    };
    let readBeforeInsertionAmount = undefined;
    await database_1.withDatabaseTransaction(test((value) => {
        readBeforeInsertionAmount = value;
    }), undefined, true);
    await database_1.withDatabaseTransaction(test((value) => {
        expect(value === readBeforeInsertionAmount).toBe(true);
    }), undefined, true);
});
//# sourceMappingURL=dummyService.test.js.map