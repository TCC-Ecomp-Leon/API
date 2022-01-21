"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const collection = 'Dummy';
function castDbData(data) {
    const castData = data;
    return castData;
}
const addDymmyData = async (data, db, session) => {
    try {
        await db.collection(collection).insertOne(data, { session });
        return { success: true, data: null };
    }
    catch (e) {
        return {
            success: false,
            error: e,
        };
    }
};
const readDummyDatas = async (db, session) => {
    try {
        const response = await db
            .collection(collection)
            .find({}, { session })
            .toArray();
        return {
            success: true,
            data: response.map((data) => castDbData(data)),
        };
    }
    catch (e) {
        return {
            success: false,
            error: e,
        };
    }
};
const updateDummyData = async (time, data, db, session) => {
    try {
        await db
            .collection(collection)
            .findOneAndUpdate({ time: time }, data, { session });
        return {
            success: true,
            data: null,
        };
    }
    catch (e) {
        return {
            success: false,
            error: e,
        };
    }
};
exports.default = {
    addDymmyData,
    readDummyDatas,
    updateDummyData,
};
//# sourceMappingURL=dummyService.js.map