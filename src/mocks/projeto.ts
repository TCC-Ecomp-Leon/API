import { Perfil, RegraPerfil, Projeto } from '../models';
import { createAuthAccount } from '../services/authentification/firebaseAuth';
import assets from '../assets/images';
import environmentVariables from '../config/environmentVariables';
import { DatabaseService, withDatabaseTransaction } from '../config/database';
import Database from '../services/data/Database';

const emailProjeto = 'projeto@test.com';
const senhaProjeto = 'projeto@test';

const mockData = async (): Promise<void> => {
  const env = environmentVariables().ENV;
  if (env !== 'LOCAL' && env !== 'BETA' && env !== 'TEST') return;

  const authResult = await createAuthAccount(emailProjeto, senhaProjeto);
  if (!authResult.success) {
    throw authResult.error;
  }

  const perfil: Perfil = {
    id: authResult.data.userId,
    email: emailProjeto,
    nome: 'PROJETO TEST',
    telefone: 12000000000,
    entradaEm: new Date(),
    fotoPerfil: assets.imgProjeto,
    regra: RegraPerfil.Administrador,
  };

  const idProjeto = '4765b63b-a539-4ef4-8180-6326f2b0ce89';
  const idCurso = '0d395efa-e08f-47d8-9b1c-34faa40e5c7f';

  const projeto: Projeto = {
    id: idProjeto,
    nome: 'PROJETO TEST',
    descricao: 'TESTE',
    email: emailProjeto,
    telefone: 12000000000,
    requisicaoEntradaEm: new Date(),
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
    idPerfilResponsavel: authResult.data.userId,
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
  };

  const service: DatabaseService<void> = async (db, session) => {
    const addPerfil = await Database.addData('Perfil', perfil, db, session);
    if (!addPerfil.success) {
      throw addPerfil.error;
    }

    const addProjeto = await Database.addData('Projeto', projeto, db, session);
    if (!addProjeto.success) {
      throw addProjeto.error;
    }
  };

  await withDatabaseTransaction(service);
};

export default mockData;
