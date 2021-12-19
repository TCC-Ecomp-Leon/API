import request from 'supertest';
import app from '../src/app';
import { backtrackObject } from './utils';

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
