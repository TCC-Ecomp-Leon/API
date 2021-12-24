import request from 'supertest';
import app from '../../src/app';
import { v1 as uuid } from 'uuid';
import { InformacoesPerfil, Perfil, RegraPerfil } from '../../src/models';
import assets from '../../src/assets/images';

const authEndpoint = '/auth/sign/';
const profileEndpoint = '/profile/';

let email: string;
let loginToken: string;
const password = 'test@test';
let perfil: Perfil;

beforeAll(async () => {
  email = uuid() + '@test.com';
  const result = await request(app).post(authEndpoint).send({
    email: email,
    password: password,
    nome: 'test',
    telefone: 12999999999,
    cpf: 'xxxxxxxx',
  });

  if (result.statusCode !== 200) {
    throw Error("Can't register the test user");
  }

  const authResult = await request(app).put(authEndpoint).send({
    email: email,
    password: password,
  });

  if (authResult.statusCode !== 200) {
    throw Error('Error sign in');
  }

  loginToken = authResult.body['authToken'];
  perfil = result.body['profile'] as Perfil;
});

afterAll(async () => {
  const result = await request(app)
    .delete(profileEndpoint)
    .set(`Authorization`, `Bearer ${loginToken}`);

  if (result.statusCode !== 200) {
    throw Error('Error deleting the test profile');
  }
});

test('Atualização das informações do perfil', async () => {
  const informacoesPerfil: InformacoesPerfil = {
    id: uuid(),
    email: uuid() + '@test.com',
    nome: 'updating',
    telefone: 12900000000,
    entradaEm: new Date(),
    fotoPerfil: assets.imgProjeto,
  };

  const updateKeys = Object.keys(informacoesPerfil);
  for (let i = 0; i < updateKeys.length; i++) {
    const key = updateKeys[i] as keyof InformacoesPerfil;
    const updatedResult = await request(app)
      .put(profileEndpoint)
      .set(`Authorization`, `Bearer ${loginToken}`)
      .send({
        profile: { [key]: informacoesPerfil[key] },
      });

    expect(updatedResult.statusCode).toBe(200);

    const getPerfil = await request(app)
      .get(profileEndpoint)
      .set(`Authorization`, `Bearer ${loginToken}`);

    expect(getPerfil.statusCode).toBe(200);

    const perfilAtualizado = getPerfil.body['profile'] as Perfil;

    if (key === 'email' || key === 'entradaEm' || key === 'id') {
      expect(perfilAtualizado[key]).toStrictEqual(perfil[key]);
    } else {
      expect(perfilAtualizado[key]).toStrictEqual(informacoesPerfil[key]);
    }
  }
});
