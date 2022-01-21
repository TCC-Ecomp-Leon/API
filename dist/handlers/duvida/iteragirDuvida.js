"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.iteragirDuvidaHandler = void 0;
const database_1 = require("../../config/database");
const models_1 = require("../../models");
const duvida_1 = require("../../schemas/duvida");
const RepositorioDuvida_1 = __importDefault(require("../../services/repositories/RepositorioDuvida"));
const handler_1 = __importDefault(require("../../structure/handler"));
const navigation_1 = require("../../structure/navigation");
exports.iteragirDuvidaHandler = new handler_1.default(async (context) => {
    const userProfile = navigation_1.getCurrentProfile(context);
    const idDuvida = context.params['id'];
    const parametroFechar = context.query['fechar'];
    let fecharDuvida = false;
    if (parametroFechar === 'true') {
        fecharDuvida = true;
    }
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
        if (!fecharDuvida) {
            const body = context.body;
            if (!duvida_1.MensagemValidator(body)) {
                return {
                    status: 400,
                    body: {
                        error: JSON.stringify(duvida_1.MensagemValidator.errors),
                    },
                };
            }
            const cast = body;
            const result = await RepositorioDuvida_1.default.adicionarMensagem(idDuvida, userProfile.id, cast.mensagem, db, session);
            if (!result.success) {
                throw result.error;
            }
            return {
                status: 200,
                body: null,
            };
        }
        else {
            const duvida = leituraDuvida.data;
            if (userProfile.regra === models_1.RegraPerfil.Geral &&
                duvida.idAluno !== userProfile.id) {
                return {
                    status: 403,
                    body: {
                        error: 'NOT_AUTHORIZED',
                    },
                };
            }
            const result = await RepositorioDuvida_1.default.fecharDuvida(idDuvida, userProfile.id, db, session);
            if (!result.success) {
                throw result.error;
            }
            return {
                status: 200,
                body: null,
            };
        }
    };
    return await database_1.withDatabaseTransaction(service);
});
//# sourceMappingURL=iteragirDuvida.js.map