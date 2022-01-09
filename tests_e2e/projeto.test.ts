import request from 'supertest';
import app from '../src/app';
import { backtrackObject, delay } from './utils';
import environmentVariables from '../src/config/environmentVariables';
import { InformacoesProjeto, Projeto } from '../src/models';
import { v1 as uuid } from 'uuid';
import assets from '../src/assets/images';

jest.setTimeout(100000);

const authEndpoint = '/auth/sign/';
const requisicaoEntradaProjetoEndpoint = '/projeto/aprovacao';
const projetosEndpoint = '/projeto';

const admEmail = 'tcc.ecomp.leon@gmail.com';
const admPassword = environmentVariables().ADM_PASSWORD;

let admAuthToken: string;
let idProjetoAprovado: string;

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

  expect(
    projetosNaoAprovados.filter(
      (projeto) => projeto.email === camposObrigatorios.email
    ).length
  ).toStrictEqual(1);

  const resultadoRegistroRepetido = await request(app)
    .post(requisicaoEntradaProjetoEndpoint)
    .send(camposObrigatorios);

  expect(resultadoRegistroRepetido.statusCode).toBe(409);

  const getProjetosNaoAprovadosDepoisRegistroRepetido = await request(app)
    .get(requisicaoEntradaProjetoEndpoint)
    .set(`Authorization`, `Bearer ${admAuthToken}`);
  expect(getProjetosNaoAprovados.statusCode).toBe(200);

  const projetosNaoAprovadosDepoisRegistroRepetido =
    getProjetosNaoAprovadosDepoisRegistroRepetido.body['projetos'] as Projeto[];
  expect(
    projetosNaoAprovadosDepoisRegistroRepetido.filter(
      (projeto) => projeto.email === camposObrigatorios.email
    ).length
  ).toStrictEqual(1);
});

test('Aprovação de projeto', async () => {
  const respondeProjetosAntesAprovacao = await request(app)
    .get(projetosEndpoint)
    .set(`Authorization`, `Bearer ${admAuthToken}`);

  expect(respondeProjetosAntesAprovacao.statusCode).toStrictEqual(200);

  const projetosAntesAprovacao = respondeProjetosAntesAprovacao.body[
    'projetos'
  ] as Projeto[];
  projetosAntesAprovacao.forEach((projeto) => {
    expect(projeto.aprovado).toStrictEqual(true);
  });

  const responseProjetosNaoAprovados = await request(app)
    .get(requisicaoEntradaProjetoEndpoint)
    .set(`Authorization`, `Bearer ${admAuthToken}`);
  expect(responseProjetosNaoAprovados.statusCode).toBe(200);

  const projetosNaoAprovados = responseProjetosNaoAprovados.body[
    'projetos'
  ] as Projeto[];

  expect(projetosNaoAprovados.length).toStrictEqual(1);

  idProjetoAprovado = projetosNaoAprovados[0].id;

  const responseAprovacaoProjeto = await request(app)
    .put(requisicaoEntradaProjetoEndpoint + '/' + idProjetoAprovado)
    .set(`Authorization`, `Bearer ${admAuthToken}`);

  expect(responseAprovacaoProjeto.statusCode).toStrictEqual(200);

  const responseProjetosNaoAprovadosAposAprovacao = await request(app)
    .get(requisicaoEntradaProjetoEndpoint)
    .set(`Authorization`, `Bearer ${admAuthToken}`);
  expect(responseProjetosNaoAprovadosAposAprovacao.statusCode).toBe(200);

  const projetosNaoAprovadosAposAprovacao =
    responseProjetosNaoAprovadosAposAprovacao.body['projetos'] as Projeto[];
  expect(projetosNaoAprovadosAposAprovacao.length).toStrictEqual(0);

  const respondeProjetosDepoisAprovacao = await request(app)
    .get(projetosEndpoint)
    .set(`Authorization`, `Bearer ${admAuthToken}`);

  expect(respondeProjetosDepoisAprovacao.statusCode).toStrictEqual(200);

  const projetosDepoisAprovacao = respondeProjetosDepoisAprovacao.body[
    'projetos'
  ] as Projeto[];
  projetosDepoisAprovacao.forEach((projeto) => {
    expect(projeto.aprovado).toStrictEqual(true);
  });

  expect(
    projetosDepoisAprovacao.length - projetosAntesAprovacao.length
  ).toStrictEqual(1);
});

test('Atualização de projeto', async () => {
  const camposOpcionais: Omit<
    InformacoesProjeto,
    'id' | 'email' | 'requisicaoEntradaEm'
  > = {
    nome: 'ATUALIZAÇÃO PROJETO',
    descricao: 'ATUALIZANDO PROJETO',
    telefone: 1,
    imgProjeto: assets.imgProjeto,
    endereco: {
      rua: 'R. ATUALIZADA',
      numero: 0,
      bairro: 'JD. ATUALIZADO',
      cidade: 'ATUALIZANTE',
      estado: 'SP',
      cep: 12000001,
      localizacao: {
        lat: 1,
        lng: 1,
      },
    },
  };

  const responseGetProjeto = await request(app)
    .get(projetosEndpoint + '/' + idProjetoAprovado)
    .set(`Authorization`, `Bearer ${admAuthToken}`);

  expect(responseGetProjeto.statusCode).toStrictEqual(200);
  const projeto = responseGetProjeto.body['projeto'] as Projeto;

  const informacoesProjeto: Omit<
    InformacoesProjeto,
    'id' | 'email' | 'requisicaoEntradaEm'
  > = {
    nome: projeto.nome,
    descricao: projeto.descricao,
    telefone: projeto.telefone,
    endereco: projeto.endereco,
    imgProjeto: projeto.imgProjeto,
  };

  const opcoesParciais = backtrackObject(camposOpcionais, true, true);

  let atualizacao = { ...informacoesProjeto };

  for (let i = 0; i < opcoesParciais.length; i++) {
    const camposAtualizar = opcoesParciais[i];
    atualizacao = { ...atualizacao, ...camposAtualizar };

    const responseAtualizacaoProjeto = await request(app)
      .put(projetosEndpoint + '/' + idProjetoAprovado)
      .set(`Authorization`, `Bearer ${admAuthToken}`)
      .send(camposAtualizar);

    expect(responseAtualizacaoProjeto.statusCode).toStrictEqual(200);

    const requestProjetoAposAtualizacao = await request(app)
      .get(projetosEndpoint + '/' + idProjetoAprovado)
      .set(`Authorization`, `Bearer ${admAuthToken}`);

    expect(requestProjetoAposAtualizacao.statusCode).toStrictEqual(200);
    const projetoAposAtualizacao = requestProjetoAposAtualizacao.body[
      'projeto'
    ] as Projeto;

    const informacoesAtualizadas: Omit<
      InformacoesProjeto,
      'id' | 'email' | 'requisicaoEntradaEm'
    > = {
      nome: projetoAposAtualizacao.nome,
      descricao: projetoAposAtualizacao.descricao,
      telefone: projetoAposAtualizacao.telefone,
      endereco: projetoAposAtualizacao.endereco,
      imgProjeto: projeto.imgProjeto,
    };

    expect(informacoesAtualizadas).toStrictEqual(atualizacao);

    await delay(100);
  }
});
