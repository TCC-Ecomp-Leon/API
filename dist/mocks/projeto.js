"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const firebaseAuth_1 = require("../services/authentification/firebaseAuth");
const images_1 = __importDefault(require("../assets/images"));
const environmentVariables_1 = __importDefault(require("../config/environmentVariables"));
const database_1 = require("../config/database");
const Database_1 = __importDefault(require("../services/data/Database"));
const insertProjeto = async (projeto, senha, db, session) => {
    const authResult = await firebaseAuth_1.createAuthAccount(projeto.email, senha);
    if (!authResult.success) {
        throw authResult.error;
    }
    const perfil = {
        id: authResult.data.userId,
        email: projeto.email,
        nome: projeto.nome,
        telefone: projeto.telefone,
        entradaEm: new Date(),
        fotoPerfil: images_1.default.imgProjeto,
        regra: models_1.RegraPerfil.Projeto,
    };
    const addPerfil = await Database_1.default.addData('Perfil', perfil, db, session);
    if (!addPerfil.success) {
        throw addPerfil.error;
    }
    const addProjeto = await Database_1.default.addData('Projeto', {
        ...projeto,
        idPerfilResponsavel: perfil.id,
    }, db, session);
    if (!addProjeto.success) {
        throw addProjeto.error;
    }
};
const mockData = async () => {
    const env = environmentVariables_1.default().ENV;
    if (env !== 'LOCAL' && env !== 'BETA' && env !== 'TEST')
        return;
    const service = async (db, session) => {
        for (let i = 0; i < mockProjetos.length; i++) {
            const { projeto, senha } = mockProjetos[i];
            await insertProjeto(projeto, senha, db, session);
        }
    };
    await database_1.withDatabaseTransaction(service);
};
exports.default = mockData;
const emailProjeto = 'projeto@test.com';
const senhaProjeto = 'projeto@test';
const emailProjeto2 = 'projeto2@test.com';
const senhaProjeto2 = 'projeto2@test';
const emailProjeto3 = 'projeto3@test.com';
const senhaProjeto3 = 'projeto3@test';
const idProjeto = '4765b63b-a539-4ef4-8180-6326f2b0ce89';
const idCurso = '0d395efa-e08f-47d8-9b1c-34faa40e5c7f';
const idProjeto2 = '147f89b7-ba1f-4c65-8066-0a910f7f7a91';
const idCurso2 = '9e87f6c2-466b-40dd-8335-5a9b9015829f';
const idProjeto3 = '71bcad70-6fb5-4de4-bd45-02a2b8cb7864';
const idCurso3 = 'f8328156-9106-4e84-a99d-eff3f09ed273';
const mockProjetos = [
    {
        projeto: {
            id: idProjeto,
            nome: 'PROJETO TEST',
            descricao: 'TESTE',
            email: emailProjeto,
            telefone: 12000000000,
            requisicaoEntradaEm: new Date(),
            imgProjeto: images_1.default.imgProjeto,
            endereco: {
                rua: 'R. TESTE TESTANDO',
                numero: 0,
                bairro: 'JD. TEST',
                cidade: 'São José dos Campos',
                estado: 'SP',
                cep: 12000000,
                localizacao: {
                    lat: 0,
                    lng: 0,
                },
            },
            aprovado: true,
            entradaEm: new Date(),
            cursos: [
                {
                    id: idCurso,
                    idProjeto: idProjeto,
                    nome: 'CURSO PROJETO TESTE',
                    descricao: 'TESTE',
                    inicioCurso: new Date('2021-09-01T00:00:00'),
                    fimCurso: new Date('2022-02-23T00:00:00'),
                    atualizadoEm: new Date(),
                    turma: [],
                    materias: [
                        {
                            id: 'cfa9b256-e33e-4a3b-93a4-e61375dbb53c',
                            nome: 'MATÉRIA TESTE',
                            descricao: 'TESTE',
                            idCurso: idCurso,
                        },
                    ],
                },
            ],
        },
        senha: senhaProjeto,
    },
    {
        projeto: {
            id: idProjeto2,
            nome: 'PROJETO TEST 2',
            descricao: 'TESTE 2',
            email: emailProjeto2,
            telefone: 12000000000,
            requisicaoEntradaEm: new Date(),
            imgProjeto: images_1.default.imgProjeto,
            endereco: {
                rua: 'R. TESTE TESTANDO 2',
                numero: 2,
                bairro: 'JD. TEST 2',
                cidade: 'São José dos Campos',
                estado: 'SP',
                cep: 12000000,
                localizacao: {
                    lat: 2,
                    lng: 2,
                },
            },
            aprovado: true,
            entradaEm: new Date(),
            cursos: [
                {
                    id: idCurso2,
                    idProjeto: idProjeto2,
                    nome: 'CURSO PROJETO TESTE 2',
                    descricao: 'TESTE 2',
                    inicioCurso: new Date('2021-09-01T00:00:00'),
                    fimCurso: new Date('2022-02-23T00:00:00'),
                    atualizadoEm: new Date(),
                    turma: [],
                    materias: [
                        {
                            id: 'cfa9b256-e33e-4a3b-93a4-e61375dbb53c',
                            nome: 'MATÉRIA TESTE',
                            descricao: 'TESTE',
                            idCurso: idCurso2,
                        },
                    ],
                },
            ],
        },
        senha: senhaProjeto2,
    },
    {
        projeto: {
            id: idProjeto3,
            nome: 'PROJETO TEST 3',
            descricao: 'TESTE 3',
            email: emailProjeto3,
            telefone: 12000000000,
            requisicaoEntradaEm: new Date(),
            imgProjeto: images_1.default.imgProjeto,
            endereco: {
                rua: 'R. TESTE TESTANDO 3',
                numero: 2,
                bairro: 'JD. TEST 3',
                cidade: 'São José dos Campos',
                estado: 'SP',
                cep: 12000000,
                localizacao: {
                    lat: 3,
                    lng: 3,
                },
            },
            aprovado: true,
            entradaEm: new Date(),
            cursos: [
                {
                    id: idCurso3,
                    idProjeto: idProjeto3,
                    nome: 'CURSO PROJETO TESTE 3',
                    descricao: 'TESTE 3',
                    inicioCurso: new Date('2021-09-01T00:00:00'),
                    fimCurso: new Date('2022-02-23T00:00:00'),
                    atualizadoEm: new Date(),
                    turma: [],
                    materias: [
                        {
                            id: 'cfa9b256-e33e-4a3b-93a4-e61375dbb53c',
                            nome: 'MATÉRIA TESTE 3',
                            descricao: 'TESTE 3',
                            idCurso: idCurso3,
                        },
                    ],
                },
            ],
        },
        senha: senhaProjeto3,
    },
];
//# sourceMappingURL=projeto.js.map