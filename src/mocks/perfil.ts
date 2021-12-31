import { Perfil, RegraPerfil } from '../models';
import assets from '../assets/images';
import environmentVariables from '../config/environmentVariables';
import { createAuthAccount } from '../services/authentification/firebaseAuth';
import Database from '../services/data/Database';
import { DatabaseService, withDatabaseTransaction } from '../config/database';
import { ClientSession, Db } from 'mongodb';

const collection = 'Perfil';

type TipoPerfilBanco = Omit<Perfil, 'associacoes' | 'universitario'>;

const insertProfile = async (
  password: string,
  _profile: Omit<TipoPerfilBanco, 'id'>,
  db: Db,
  session: ClientSession
) => {
  const resultAdmAuth = await createAuthAccount(_profile.email, password);
  if (!resultAdmAuth.success) {
    throw resultAdmAuth.error;
  }

  const profile: TipoPerfilBanco = {
    ..._profile,
    id: resultAdmAuth.data.userId,
  };

  const addResult = await Database.addData<TipoPerfilBanco>(
    collection,
    profile,
    db,
    session
  );
  if (!addResult.success) {
    throw addResult.error;
  }
};

const mockData = async (): Promise<void> => {
  const admPassword = environmentVariables().ADM_PASSWORD;
  const admEmail = 'tcc.ecomp.leon@gmail.com';

  const service: DatabaseService<void> = async (db, session) => {
    await insertProfile(
      admPassword,
      {
        email: admEmail,
        nome: 'ADMINISTRADOR',
        telefone: 12000000000,
        entradaEm: new Date(),
        fotoPerfil: assets.imgPerfil,
        regra: RegraPerfil.Administrador,
      },
      db,
      session
    );

    if (environmentVariables().ENV !== 'PROD') {
      for (let i = 0; i < perfisGerais.length; i++) {
        const { perfil, password } = perfisGerais[i];

        await insertProfile(password, perfil, db, session);
      }
    }
  };

  await withDatabaseTransaction(service);
};

export default mockData;

const perfisGerais: {
  perfil: Omit<TipoPerfilBanco & { regra: RegraPerfil.Geral }, 'id'>;
  password: string;
}[] = [
  {
    perfil: {
      email: 'user1@test.com',
      nome: 'Usuário genérico 1',
      telefone: 12000000000,
      entradaEm: new Date(),
      fotoPerfil: assets.imgPerfil,
      regra: RegraPerfil.Geral,
    },
    password: 'user1@test',
  },
  {
    perfil: {
      email: 'user2@test.com',
      nome: 'Usuário genérico 2',
      telefone: 12000000000,
      entradaEm: new Date(),
      fotoPerfil: assets.imgPerfil,
      regra: RegraPerfil.Geral,
    },
    password: 'user2@test',
  },
  {
    perfil: {
      email: 'user3@test.com',
      nome: 'Usuário genérico 3',
      telefone: 12000000000,
      entradaEm: new Date(),
      fotoPerfil: assets.imgPerfil,
      regra: RegraPerfil.Geral,
    },
    password: 'user3@test',
  },
];
