"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpNavigation = void 0;
const signUpHandler_1 = require("../../handlers/auth/signUpHandler");
const profile_1 = require("../../schemas/profile");
const navigation_1 = __importDefault(require("../../structure/navigation"));
const codigoEntrada_1 = require("../../schemas/codigoEntrada");
const RepositorioPerfil_1 = __importDefault(require("../../services/repositories/RepositorioPerfil"));
exports.signUpNavigation = new navigation_1.default([
    signUpHandler_1.signUpHandler([profile_1.ProfileValidator], [
        {
            activationFunction: (body) => {
                const codigoDeEntrada = body['codigoDeEntrada'];
                return codigoDeEntrada !== undefined;
            },
            validator: codigoEntrada_1.ValidatorUsoCodigoDeEntrada,
        },
    ], (body) => {
        return {
            email: body.email,
            nome: body.nome,
            cpf: body.cpf,
            telefone: body.telefone,
        };
    }, async (userId, profile, context, db, session) => {
        const _codigoDeEntrada = context.body['codigoDeEntrada'];
        const codigoDeEntrada = _codigoDeEntrada !== undefined && _codigoDeEntrada !== null
            ? _codigoDeEntrada
            : undefined;
        const adicionarPerfil = await RepositorioPerfil_1.default.addPerfilGeral(userId, profile.email, profile.nome, profile.telefone, codigoDeEntrada, db, session);
        if (!adicionarPerfil.success) {
            throw adicionarPerfil.error;
        }
        return {
            success: true,
            data: null,
        };
    }),
]);
//# sourceMappingURL=signUpNavigation.js.map