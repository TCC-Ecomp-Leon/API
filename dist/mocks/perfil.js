"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const images_1 = __importDefault(require("../assets/images"));
const environmentVariables_1 = __importDefault(require("../config/environmentVariables"));
const firebaseAuth_1 = require("../services/authentification/firebaseAuth");
const Database_1 = __importDefault(require("../services/data/Database"));
const database_1 = require("../config/database");
const collection = 'Perfil';
const insertProfile = async (password, _profile, db, session) => {
    const resultAdmAuth = await firebaseAuth_1.createAuthAccount(_profile.email, password);
    if (!resultAdmAuth.success) {
        throw resultAdmAuth.error;
    }
    const profile = {
        ..._profile,
        id: resultAdmAuth.data.userId,
    };
    const addResult = await Database_1.default.addData(collection, profile, db, session);
    if (!addResult.success) {
        throw addResult.error;
    }
};
const mockData = async () => {
    const admPassword = environmentVariables_1.default().ADM_PASSWORD;
    const admEmail = 'tcc.ecomp.leon@gmail.com';
    const service = async (db, session) => {
        await insertProfile(admPassword, {
            email: admEmail,
            nome: 'ADMINISTRADOR',
            telefone: 12000000000,
            entradaEm: new Date(),
            fotoPerfil: images_1.default.imgPerfil,
            regra: models_1.RegraPerfil.Administrador,
        }, db, session);
        if (environmentVariables_1.default().ENV !== 'PROD') {
            for (let i = 0; i < perfisGerais.length; i++) {
                const { perfil, password } = perfisGerais[i];
                await insertProfile(password, perfil, db, session);
            }
        }
    };
    await database_1.withDatabaseTransaction(service);
};
exports.default = mockData;
const perfisGerais = [
    {
        perfil: {
            email: 'user1@test.com',
            nome: 'Usuário genérico 1',
            telefone: 12000000000,
            entradaEm: new Date(),
            fotoPerfil: images_1.default.imgPerfil,
            regra: models_1.RegraPerfil.Geral,
        },
        password: 'user1@test',
    },
    {
        perfil: {
            email: 'user2@test.com',
            nome: 'Usuário genérico 2',
            telefone: 12000000000,
            entradaEm: new Date(),
            fotoPerfil: images_1.default.imgPerfil,
            regra: models_1.RegraPerfil.Geral,
        },
        password: 'user2@test',
    },
    {
        perfil: {
            email: 'user3@test.com',
            nome: 'Usuário genérico 3',
            telefone: 12000000000,
            entradaEm: new Date(),
            fotoPerfil: images_1.default.imgPerfil,
            regra: models_1.RegraPerfil.Geral,
        },
        password: 'user3@test',
    },
    {
        perfil: {
            email: 'universitario1@unifesp.br',
            nome: 'Universitário 1',
            telefone: 12000000000,
            entradaEm: new Date(),
            fotoPerfil: images_1.default.imgPerfil,
            regra: models_1.RegraPerfil.Geral,
        },
        password: 'universitario1@unifesp',
    },
    {
        perfil: {
            email: 'universitario2@unifesp.br',
            nome: 'Universitário 2',
            telefone: 12000000000,
            entradaEm: new Date(),
            fotoPerfil: images_1.default.imgPerfil,
            regra: models_1.RegraPerfil.Geral,
        },
        password: 'universitario2@unifesp',
    },
];
//# sourceMappingURL=perfil.js.map