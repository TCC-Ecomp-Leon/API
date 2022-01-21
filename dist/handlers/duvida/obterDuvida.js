"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.obterDuvidaHandler = void 0;
const database_1 = require("../../config/database");
const RepositorioDuvida_1 = __importDefault(require("../../services/repositories/RepositorioDuvida"));
const handler_1 = __importDefault(require("../../structure/handler"));
const navigation_1 = require("../../structure/navigation");
exports.obterDuvidaHandler = new handler_1.default(async (context) => {
    const userProfile = navigation_1.getCurrentProfile(context);
    const idDuvida = context.params['id'];
    const service = async (db, session) => {
        const leituraDuvida = await RepositorioDuvida_1.default.readDuvida(idDuvida, db, session);
        if (!leituraDuvida.success) {
            return {
                status: 404,
                body: {
                    error: 'DATA_NOT_FOUND',
                },
            };
        }
        return {
            status: 200,
            body: {
                duvida: leituraDuvida.data,
            },
        };
    };
    return await database_1.withDatabaseTransaction(service);
});
//# sourceMappingURL=obterDuvida.js.map