import request from 'supertest';
import app from '../src/app';
import { backtrackObject } from './utils';
import { Perfil, RegraPerfil } from '../src/models';
import assets from '../src/assets/images';

const endpoint = '/auth/sign/';

const camposObrigatorios: {
  email: string;
  password: string;
  nome: string;
  telefone: number;
  cpf: string;
} = {
  email: 'test@test.com',
  password: 'test@test',
  nome: 'test',
  telefone: 12999999999,
  cpf: 'xxxxxxxx',
};

const camposOpcionais: { codigoDeEntrada: string } = {
  codigoDeEntrada: 'XXXXX',
};

const camposObrigatoriosLogin: { email: string; password: string } = {
  email: camposObrigatorios.email,
  password: camposObrigatorios.password,
};

test('Passagem de parâmetros errados para o endpoint de registro', async () => {
  const opcoesComErros = backtrackObject(camposObrigatorios, true, false);

  for (let i = 0; i < opcoesComErros.length; i++) {
    const result1 = await request(app).post(endpoint).send(opcoesComErros[i]);

    expect(result1.statusCode).toBe(400);

    const result2 = await request(app)
      .post(endpoint)
      .send({ ...opcoesComErros[i], ...camposOpcionais });

    expect(result2.statusCode).toBe(400);
  }
});

test('Uso correto do endpoint de signUp sem código de registro', async () => {
  const result = await request(app).post(endpoint).send(camposObrigatorios);

  expect(result.statusCode).toBe(200);
});

test('Tentativa de registrar um usuário novamente', async () => {
  const result = await request(app).post(endpoint).send(camposObrigatorios);

  expect(result.statusCode).toBeGreaterThanOrEqual(400);
});

test('Passagem de parâmetros errados para o endpoint de login', async () => {
  const opcoesComErros = backtrackObject(camposObrigatoriosLogin, true, false);

  for (let i = 0; i < opcoesComErros.length; i++) {
    const result = await request(app).put(endpoint).send(opcoesComErros[i]);

    expect(result.statusCode).toBe(400);
  }
});

test('Tentativa de entrar com o usuário e senha registrados', async () => {
  const result = await request(app).put(endpoint).send(camposObrigatoriosLogin);

  expect(result.statusCode).toBe(200);

  const perfil = result.body['profile'] as Perfil;

  expect(perfil.email).toStrictEqual(camposObrigatorios.email);
  expect(perfil.fotoPerfil).toStrictEqual(assets.imgPerfil);
  expect(perfil.nome).toStrictEqual(camposObrigatorios.nome);
  expect(perfil.telefone).toStrictEqual(camposObrigatorios.telefone);
  expect(perfil.regra).toStrictEqual(RegraPerfil.Geral);

  if (perfil.regra !== RegraPerfil.Geral) throw Error('');

  expect(perfil.associacoes.aluno.alunoParceiro).toStrictEqual(false);
  expect(perfil.associacoes.professor.professor).toStrictEqual(false);
  expect(perfil.universitario.universitario).toStrictEqual(false);
});
