import { Perfil, RegraPerfil } from '../models';
import assets from '../assets/images';
import environmentVariables from '../config/environmentVariables';
import { createAuthAccount } from '../services/authentification/firebaseAuth';
import Database from '../services/data/Database';
import { DatabaseService, withDatabaseTransaction } from '../config/database';

const collection = 'Perfil';

const mockData = async (): Promise<void> => {
  const admPassword = environmentVariables().ADM_PASSWORD;
  const admEmail = 'tcc.ecomp.leon@gmail.com';

  const resultAdmAuth = await createAuthAccount(admEmail, admPassword);
  if (!resultAdmAuth.success) {
    throw resultAdmAuth.error;
  }

  const perfil: Perfil = {
    id: resultAdmAuth.data.userId,
    email: admEmail,
    nome: 'ADMINISTRADOR',
    telefone: 12000000000,
    entradaEm: new Date(),
    fotoPerfil: assets.imgPerfil,
    regra: RegraPerfil.Administrador,
  };

  const service: DatabaseService<void> = async (db, session) => {
    const addResult = await Database.addData<Perfil>(
      collection,
      perfil,
      db,
      session
    );
    if (!addResult.success) {
      throw addResult.error;
    }
  };

  await withDatabaseTransaction(service);
};

export default mockData;
