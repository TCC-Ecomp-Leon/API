"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withDatabaseTransaction = exports.TransactionModes = void 0;
const mongodb_1 = require("mongodb");
const environmentVariables_1 = __importDefault(require("./environmentVariables"));
const client = new mongodb_1.MongoClient(environmentVariables_1.default().MONGODB_URL, {
    ignoreUndefined: true,
});
var TransactionModes;
(function (TransactionModes) {
    /**
     * Mongo db default transaction configuration.
     */
    TransactionModes[TransactionModes["default"] = 0] = "default";
    /**
     * Mongo db transaction using configurations to sped up connections and without
     * casually consistence guarantee.
     */
    TransactionModes[TransactionModes["parallel"] = 1] = "parallel";
    /**
     * Mongo db transaction using configurations to create a level of casually consistence
     * reading.
     */
    TransactionModes[TransactionModes["critical"] = 2] = "critical";
    /**
     * Mongo db transaction using configurations to create a read and write casually
     * consistence.
     */
    TransactionModes[TransactionModes["bank"] = 3] = "bank";
})(TransactionModes = exports.TransactionModes || (exports.TransactionModes = {}));
const getTransactionOptions = (transactionMode) => {
    if (transactionMode === TransactionModes.bank) {
        return {
            //Default mode. All operations read from the current replica set primary.
            readPreference: new mongodb_1.ReadPreference(mongodb_1.ReadPreferenceMode.primary),
            //The query returns the data that has been acknowledged by a majority of the
            //replica set members. The documents returned by the read operation are durable,
            //even in the event of failure.
            readConcern: new mongodb_1.ReadConcern(mongodb_1.ReadConcernLevel.majority),
            writeConcern: {
                //Requests acknowledgment that write operations have propagated to the
                //calculated majority of the data-bearing voting members
                w: 'majority',
                //If j: true, requests acknowledgment that the mongod instances, as specified
                //in the w: <value>, have written to the on-disk journal. j: true does not by
                //itself guarantee that the write will not be rolled back due to replica set
                //primary failover.
                j: true,
                //wtimeout causes write operations to return with an error after the specified
                //limit, even if the required write concern will eventually succeed
                wtimeout: wTimeOut,
            },
        };
    }
    else if (transactionMode === TransactionModes.critical) {
        return {
            //Default mode. All operations read from the current replica set primary.
            readPreference: new mongodb_1.ReadPreference(mongodb_1.ReadPreferenceMode.primary),
            //The query returns data that reflects all successful majority-acknowledged
            //writes that completed prior to the start of the read operation. The query
            //may wait for concurrently executing writes to propagate to a majority of
            //replica set members before returning results.
            readConcern: new mongodb_1.ReadConcern(mongodb_1.ReadConcernLevel.linearizable),
            writeConcern: {
                //Requests acknowledgment that write operations have propagated to the
                //calculated majority of the data-bearing voting members
                w: 'majority',
                //If j: true, requests acknowledgment that the mongod instances, as specified
                //in the w: <value>, have written to the on-disk journal. j: true does not by
                //itself guarantee that the write will not be rolled back due to replica set
                //primary failover.
                j: true,
                //wtimeout causes write operations to return with an error after the specified
                //limit, even if the required write concern will eventually succeed
                wtimeout: wTimeOut,
            },
        };
    }
    else if (transactionMode === TransactionModes.parallel) {
        return {
            //Operations read from a random eligible replica set member, irrespective of
            //whether that member is a primary or secondary, based on a specified latency
            //threshold.
            readPreference: new mongodb_1.ReadPreference(mongodb_1.ReadPreferenceMode.nearest),
            //The query returns data from the instance with no guarantee that the data
            //has been written to a majority of the replica set members
            //(i.e. may be rolled back).
            //For sharded clusters, "available" read concern provides the lowest latency
            //reads possible among the various read concerns.
            readConcern: new mongodb_1.ReadConcern(mongodb_1.ReadConcernLevel.available),
            writeConcern: {
                //Requests acknowledgment that write operations have propagated to the
                //calculated majority of the data-bearing voting members
                w: 'majority',
                //Acknowledgment requires writing operation in memory.
                j: false,
                //wtimeout causes write operations to return with an error after the specified
                //limit, even if the required write concern will eventually succeed
                wtimeout: wTimeOut,
            },
        };
    }
    return {
        //Default mode. All operations read from the current replica set primary.
        readPreference: new mongodb_1.ReadPreference(mongodb_1.ReadPreferenceMode.primary),
        readConcern: new mongodb_1.ReadConcern(mongodb_1.ReadConcernLevel.local),
        writeConcern: {
            //Requests acknowledgment that write operations have propagated to the
            //calculated majority of the data-bearing voting members
            w: 'majority',
            //Acknowledgment requires writing operation in memory.
            j: false,
            //wtimeout causes write operations to return with an error after the specified
            //limit, even if the required write concern will eventually succeed
            wtimeout: wTimeOut,
        },
    };
};
const withDatabaseTransaction = async (service, transactionMode = TransactionModes.default, rollback) => {
    await client.connect();
    const session = client.startSession();
    const transactionOptions = getTransactionOptions(transactionMode);
    const result = new Promise(async (resolve, reject) => {
        try {
            await session.withTransaction(async () => {
                const result = await service(client.db(), session);
                if (rollback !== undefined && rollback) {
                    await session.abortTransaction();
                    await session.endSession();
                    // await client.close();
                }
                else {
                    await session.commitTransaction();
                    await session.endSession();
                    // await client.close();
                }
                resolve(result);
            }, transactionOptions);
        }
        catch (e) {
            console.warn('MONGODB ERROR');
            console.warn(e);
            await session.endSession();
            // await client.close();
            reject(e);
        }
    });
    return result;
};
exports.withDatabaseTransaction = withDatabaseTransaction;
/**
 * Timeout for the write operations in the mongodb cluster.
 */
const wTimeOut = 2000;
//# sourceMappingURL=database.js.map