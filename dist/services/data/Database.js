"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const removeEmptyObjects = (array) => {
    const list = [];
    array.forEach((value) => {
        if (Object.keys(value).length !== 0) {
            list.push(value);
        }
    });
    return list;
};
const _getValues = (searchParameters) => {
    let search = {};
    for (let i = 0; i < searchParameters.length; i++) {
        const { key, value } = searchParameters[i];
        search = { ...search, [key]: value };
    }
    return search;
};
const addData = async (collection, data, db, session) => {
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
const updatePartialData = async (collection, searchParameters, data, db, session) => {
    try {
        await db
            .collection(collection)
            .updateOne(_getValues(searchParameters), { $set: data }, { session });
        return { success: true, data: null };
    }
    catch (e) {
        return {
            success: false,
            error: e,
        };
    }
};
const insertNestedFieldPrefix = (prefix, data) => {
    let ret = {};
    const keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        ret = {
            ...ret,
            [prefix + key]: data[key],
        };
    }
    return ret;
};
const updateNestedPartialData = async (collection, searchParameters, keyField, data, db, session) => {
    try {
        await db
            .collection(collection)
            .updateOne(_getValues(searchParameters), { $set: insertNestedFieldPrefix(keyField + '.', data) }, { session });
        return { success: true, data: null };
    }
    catch (e) {
        return {
            success: false,
            error: e,
        };
    }
};
const updatePushData = async (collection, searchParameters, keyField, data, db, session) => {
    try {
        const result = await db
            .collection(collection)
            .updateOne(_getValues(searchParameters), { $push: { [keyField]: data } }, { session });
        return { success: true, data: null };
    }
    catch (e) {
        return {
            success: false,
            error: e,
        };
    }
};
const updateGenericData = async (collection, searchParameters, updateParameters, db, session) => {
    try {
        const result = await db
            .collection(collection)
            .updateOne(_getValues(searchParameters), { $set: _getValues(updateParameters) }, { session });
        return { success: true, data: null };
    }
    catch (e) {
        return {
            success: false,
            error: e,
        };
    }
};
const updateGenericDatas = async (collection, searchParameters, updateParameters, db, session) => {
    try {
        const result = await db
            .collection(collection)
            .updateMany(_getValues(searchParameters), { $set: _getValues(updateParameters) }, { session });
        return { success: true, data: null };
    }
    catch (e) {
        return {
            success: false,
            error: e,
        };
    }
};
const readData = async (collection, searchParameters, db, session) => {
    try {
        const response = await db
            .collection(collection)
            .find(_getValues(searchParameters), { session: session })
            .toArray();
        if (response.length === 0) {
            return {
                success: false,
                error: Error('Not found'),
            };
        }
        return {
            success: true,
            data: response[0],
        };
    }
    catch (e) {
        return {
            success: false,
            error: e,
        };
    }
};
const readDatas = async (collection, searchParameters, db, session, fields) => {
    try {
        const responseFields = {};
        if (fields !== undefined) {
            responseFields['_id'] = 0;
            fields.forEach((key) => {
                responseFields[key] = 1;
            });
        }
        const response = await db
            .collection(collection)
            .find(_getValues(searchParameters), {
            projection: responseFields,
            session: session,
        })
            .toArray();
        return {
            success: true,
            data: removeEmptyObjects(response),
        };
    }
    catch (e) {
        return {
            success: false,
            error: e,
        };
    }
};
const readCollection = async (collection, db, session) => {
    try {
        const response = await db
            .collection(collection)
            .find({}, { session })
            .toArray();
        return {
            success: true,
            data: response.map((data) => data),
        };
    }
    catch (e) {
        return {
            success: false,
            error: e,
        };
    }
};
const remove = async (collection, searchParameters, db, session) => {
    try {
        const response = await db
            .collection(collection)
            .findOneAndDelete(_getValues(searchParameters), { session });
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
    addData,
    readData,
    readDatas,
    readCollection,
    updatePartialData,
    updateGenericDatas,
    updateGenericData,
    updatePushData,
    updateNestedPartialData,
    remove,
};
//# sourceMappingURL=Database.js.map