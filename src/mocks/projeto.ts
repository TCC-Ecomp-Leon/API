import { Perfil, RegraPerfil, Projeto } from '../models';
import { createAuthAccount } from '../services/authentification/firebaseAuth';
import assets from '../assets/images';
import environmentVariables from '../config/environmentVariables';
import { DatabaseService, withDatabaseTransaction } from '../config/database';
import Database from '../services/data/Database';
import { ClientSession, Db } from 'mongodb';

const insertProjeto = async (
  projeto: Omit<Projeto & { aprovado: true }, 'idPerfilResponsavel'>,
  senha: string,
  db: Db,
  session: ClientSession
) => {
  const authResult = await createAuthAccount(projeto.email, senha);
  if (!authResult.success) {
    throw authResult.error;
  }

  const perfil: Perfil = {
    id: authResult.data.userId,
    email: projeto.email,
    nome: projeto.nome,
    telefone: projeto.telefone,
    entradaEm: new Date(),
    fotoPerfil: assets.imgProjeto,
    regra: RegraPerfil.Projeto,
  };

  const addPerfil = await Database.addData('Perfil', perfil, db, session);
  if (!addPerfil.success) {
    throw addPerfil.error;
  }

  const addProjeto = await Database.addData<Projeto>(
    'Projeto',
    {
      ...projeto,
      idPerfilResponsavel: perfil.id,
    },
    db,
    session
  );
  if (!addProjeto.success) {
    throw addProjeto.error;
  }
};

const mockData = async (): Promise<void> => {
  const env = environmentVariables().ENV;
  if (env !== 'LOCAL' && env !== 'BETA' && env !== 'TEST') return;

  const service: DatabaseService<void> = async (db, session) => {
    for (let i = 0; i < mockProjetos.length; i++) {
      const { projeto, senha } = mockProjetos[i];

      await insertProjeto(projeto, senha, db, session);
    }
  };

  await withDatabaseTransaction(service);
};

export default mockData;

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

const mockProjetos: {
  projeto: Omit<Projeto & { aprovado: true }, 'idPerfilResponsavel'>;
  senha: string;
}[] = [
  {
    projeto: {
      id: idProjeto,
      nome: 'PROJETO TEST',
      descricao: 'TESTE',
      email: emailProjeto,
      telefone: 12000000000,
      requisicaoEntradaEm: new Date(),
      imgProjeto: assets.imgProjeto,
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
      imgProjeto: assets.imgProjeto,
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
      imgProjeto: assets.imgProjeto,
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
