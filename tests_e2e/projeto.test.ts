import request from 'supertest';
import app from '../src/app';
import { backtrackObject } from './utils';
import environmentVariables from '../src/config/environmentVariables';
import { InformacoesProjeto, Projeto } from '../src/models';
import { v1 as uuid } from 'uuid';

const authEndpoint = '/auth/sign/';
const requisicaoEntradaProjetoEndpoint = '/projeto/aprovacao';

const admEmail = 'tcc.ecomp.leon@gmail.com';
const admPassword = environmentVariables().ADM_PASSWORD;

let admAuthToken: string;

beforeAll(async () => {
  const authResult = await request(app).put(authEndpoint).send({
    email: admEmail,
    password: admPassword,
  });

  if (authResult.statusCode !== 200) {
    throw Error('Error sign in');
  }

  admAuthToken = authResult.body['authToken'];
});

test('Registro de projeto', async () => {
  const camposObrigatorios: Omit<
    InformacoesProjeto,
    'id' | 'requisicaoEntradaEm'
  > = {
    nome: 'PROJETO TEST ENDPOINT',
    descricao: 'TESTE',
    email: uuid() + '@test.com',
    telefone: 0,
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
  };
  const opcoesComErros = backtrackObject(camposObrigatorios, true, false);

  for (let i = 0; i < opcoesComErros.length; i++) {
    const result = await request(app)
      .post(requisicaoEntradaProjetoEndpoint)
      .send(opcoesComErros[i]);

    expect(result.statusCode).toBe(400);
  }

  const resultadoRegistro = await request(app)
    .post(requisicaoEntradaProjetoEndpoint)
    .send(camposObrigatorios);

  expect(resultadoRegistro.statusCode).toBe(200);

  const getProjetosNaoAprovados = await request(app)
    .get(requisicaoEntradaProjetoEndpoint)
    .set(`Authorization`, `Bearer ${admAuthToken}`);
  expect(getProjetosNaoAprovados.statusCode).toBe(200);

  const projetosNaoAprovados = getProjetosNaoAprovados.body[
    'projetos'
  ] as Projeto[];
  projetosNaoAprovados.forEach((projeto) =>
    expect(projeto.aprovado).toStrictEqual(false)
  );
  console.log(projetosNaoAprovados);

  expect(
    projetosNaoAprovados.find(
      (projeto) => projeto.email === camposObrigatorios.email
    )
  ).not.toBe(undefined);
});
