"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dummyGetHandler = void 0;
const database_1 = require("../../config/database");
const dummyService_1 = __importDefault(require("../../services/data/dummyService"));
const handler_1 = __importDefault(require("../../structure/handler"));
exports.dummyGetHandler = new handler_1.default(async (context) => {
    const data = { message: 'test', time: new Date() };
    const service = async (db, session) => {
        const addResult = await dummyService_1.default.addDymmyData(data, db, session);
        if (!addResult.success) {
            throw addResult.error;
        }
        const readResult = await dummyService_1.default.readDummyDatas(db, session);
        if (!readResult.success) {
            throw readResult.error;
        }
        const updateResult = await dummyService_1.default.updateDummyData(data.time, { message: 'updated' }, db, session);
        if (!updateResult.success) {
            throw updateResult.error;
        }
        return {
            status: 200,
            body: { message: 'Success', data: readResult.data },
        };
    };
    return await database_1.withDatabaseTransaction(service);
});
//# sourceMappingURL=dummyGetHandler.js.map