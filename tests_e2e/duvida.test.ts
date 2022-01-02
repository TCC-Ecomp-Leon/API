import request from 'supertest';
import app from '../src/app';
import {
  CodigoDeEntrada,
  Duvida,
  Perfil,
  RegraPerfil,
  TipoCodigoDeEntrada,
} from '../src/models';
import { InformacoesDuvida } from '../src/schemas/duvida';
import { backtrackObject, delay } from './utils';
import { v4 as uuid } from 'uuid';

jest.setTimeout(100000);

const emailProjeto = 'projeto2@test.com';
const senhaProjeto = 'projeto2@test';

const duvidaEndpoint = '/duvida';
const authEndpoint = '/auth/sign/';
const codigoDeEntradaEndpoint = '/codigo-de-entrada';

const emailAluno = 'aluno@test.com';
const senhaAluno = 'aluno@test';

const idProjeto = '147f89b7-ba1f-4c65-8066-0a910f7f7a91';
const idCurso = '9e87f6c2-466b-40dd-8335-5a9b9015829f';

const idOutrProjeto = '4765b63b-a539-4ef4-8180-6326f2b0ce89';

let authTokenAluno: string;
let idPerfilAluno: string;
let projetoAuthToken: string;

let idCodigoDeEntrada: string;

const informacoesAluno: InformacoesRegistroPerfil = {
  email: emailAluno,
  password: senhaAluno,
  nome: 'Aluno teste dúvidas',
  telefone: 12,
  cpf: 'YYYYYYYY',
};

const informacoesCodigoDeEntradaAluno: InformacoesCodigo = {
  tipo: TipoCodigoDeEntrada.Aluno,
  idCurso: idCurso,
};

const informacoesDuvidaSimples: InformacoesDuvida = {
  titulo: 'Teste dúvida',
  descricao: 'Testando',
  idCurso: idCurso,
  idMateria: null,
  primeiraMensagem: 'Eu tenho uma dúvida sobre o uso da aplicação',
  idCursoUniversitario: null,
};

let duvidaAdicionada: Duvida;

/**
 * Obtenção das credenciais de login de projeto e aluno, além de registrar
 * um aluno para os nossos testes usando um código de entrada.
 */
beforeAll(async () => {
  const signInProjeto = await signIn(emailProjeto, senhaProjeto);
  projetoAuthToken = signInProjeto.authToken;
  idCodigoDeEntrada = await registrarCodigoDeEntrada(
    informacoesCodigoDeEntradaAluno
  );
  authTokenAluno = await registrarPerfil(informacoesAluno, idCodigoDeEntrada);
  const signInAluno = await signIn(
    informacoesAluno.email,
    informacoesAluno.password
  );
  authTokenAluno = signInAluno.authToken;
  if (signInAluno.perfil.regra !== RegraPerfil.Geral) throw Error('');
  idPerfilAluno = signInAluno.perfil.id;
});

test('Testando o registro de uma dúvida com informações erradas', async () => {
  const opcoesComErros = backtrackObject(informacoesDuvidaSimples, true, false);
  for (let i = 0; i < opcoesComErros.length; i++) {
    const result = await request(app)
      .post(duvidaEndpoint)
      .set(`Authorization`, `Bearer ${authTokenAluno}`)
      .send(opcoesComErros[i]);

    expect(result.statusCode).toStrictEqual(400);
  }

  let result = await request(app)
    .post(duvidaEndpoint)
    .set(`Authorization`, `Bearer ${authTokenAluno}`)
    .send({ ...informacoesDuvidaSimples, idCurso: uuid() });

  expect(result.statusCode).toStrictEqual(403);

  result = await request(app)
    .post(duvidaEndpoint)
    .set(`Authorization`, `Bearer ${authTokenAluno}`)
    .send({ ...informacoesDuvidaSimples, idMateria: uuid() });

  expect(result.statusCode).toStrictEqual(403);

  result = await request(app)
    .post(duvidaEndpoint)
    .set(`Authorization`, `Bearer ${authTokenAluno}`)
    .send({ ...informacoesDuvidaSimples, idCursoUniversitario: uuid() });

  expect(result.statusCode).toStrictEqual(404);
});

test('Registro correto de uma dúvida simples', async () => {
  const duvidasGeraisAntes = await obterDuvidas(authTokenAluno);
  const duvidasProjetoReqAlunoAntes = await obterDuvidas(
    authTokenAluno,
    idProjeto
  );
  const duvidasProjetoReqProjetoAntes = await obterDuvidas(projetoAuthToken);
  const duvidasOutroProjetoAntes = await obterDuvidas(
    authTokenAluno,
    idOutrProjeto
  );

  const result = await request(app)
    .post(duvidaEndpoint)
    .set(`Authorization`, `Bearer ${authTokenAluno}`)
    .send(informacoesDuvidaSimples);

  expect(result.statusCode).toStrictEqual(200);

  const duvidasGeraisDepois = await obterDuvidas(authTokenAluno);
  const duvidasProjetoReqAlunoDepois = await obterDuvidas(
    authTokenAluno,
    idProjeto
  );
  const duvidasProjetoReqProjetoDepois = await obterDuvidas(projetoAuthToken);
  const duvidasOutroProjetoDepois = await obterDuvidas(
    authTokenAluno,
    idOutrProjeto
  );

  expect(duvidasGeraisDepois.length - duvidasGeraisAntes.length).toStrictEqual(
    1
  );
  expect(
    duvidasProjetoReqAlunoDepois.length - duvidasProjetoReqAlunoAntes.length
  ).toStrictEqual(1);
  expect(
    duvidasProjetoReqProjetoDepois.length - duvidasProjetoReqProjetoAntes.length
  ).toStrictEqual(1);

  expect(duvidasOutroProjetoDepois.length).toStrictEqual(
    duvidasOutroProjetoAntes.length
  );

  const idDuvidasAntes = duvidasGeraisAntes.map((duvida) => duvida.id);
  const novasDuvidas = duvidasGeraisDepois.filter(
    (duvida) => !idDuvidasAntes.includes(duvida.id)
  );

  duvidaAdicionada = novasDuvidas[0];
  expect({
    titulo: duvidaAdicionada.titulo,
    descricao: duvidaAdicionada.descricao,
    idCurso: duvidaAdicionada.idCursoAluno,
    idMateria: duvidaAdicionada.idMateria,
    primeiraMensagem: undefined,
    idCursoUniversitario: duvidaAdicionada.idCursoUniversitario,
  }).toStrictEqual({
    ...informacoesDuvidaSimples,
    primeiraMensagem: undefined,
  });

  expect(duvidaAdicionada.mensagens.length).toStrictEqual(1);
  expect(duvidaAdicionada.mensagens[0].mensagem).toStrictEqual(
    informacoesDuvidaSimples.primeiraMensagem
  );
  expect(duvidaAdicionada.mensagens[0].idPerfil).toStrictEqual(idPerfilAluno);
});

test('Criação de uma segunda dúvida', async () => {
  const duvidasGeraisAntes = await obterDuvidas(authTokenAluno);
  const duvidasProjetoReqAlunoAntes = await obterDuvidas(
    authTokenAluno,
    idProjeto
  );
  const duvidasProjetoReqProjetoAntes = await obterDuvidas(projetoAuthToken);
  const duvidasOutroProjetoAntes = await obterDuvidas(
    authTokenAluno,
    idOutrProjeto
  );

  const result = await request(app)
    .post(duvidaEndpoint)
    .set(`Authorization`, `Bearer ${authTokenAluno}`)
    .send(informacoesDuvidaSimples);

  expect(result.statusCode).toStrictEqual(200);

  const duvidasGeraisDepois = await obterDuvidas(authTokenAluno);
  const duvidasProjetoReqAlunoDepois = await obterDuvidas(
    authTokenAluno,
    idProjeto
  );
  const duvidasProjetoReqProjetoDepois = await obterDuvidas(projetoAuthToken);
  const duvidasOutroProjetoDepois = await obterDuvidas(
    authTokenAluno,
    idOutrProjeto
  );

  expect(duvidasGeraisDepois.length - duvidasGeraisAntes.length).toStrictEqual(
    1
  );
  expect(
    duvidasProjetoReqAlunoDepois.length - duvidasProjetoReqAlunoAntes.length
  ).toStrictEqual(1);
  expect(
    duvidasProjetoReqProjetoDepois.length - duvidasProjetoReqProjetoAntes.length
  ).toStrictEqual(1);

  expect(duvidasOutroProjetoDepois.length).toStrictEqual(
    duvidasOutroProjetoAntes.length
  );

  const idDuvidasAntes = duvidasGeraisAntes.map((duvida) => duvida.id);
  const novasDuvidas = duvidasGeraisDepois.filter(
    (duvida) => !idDuvidasAntes.includes(duvida.id)
  );

  const duvidaSegundaria = novasDuvidas[0];
  expect({
    titulo: duvidaSegundaria.titulo,
    descricao: duvidaSegundaria.descricao,
    idCurso: duvidaSegundaria.idCursoAluno,
    idMateria: duvidaSegundaria.idMateria,
    primeiraMensagem: undefined,
    idCursoUniversitario: duvidaSegundaria.idCursoUniversitario,
  }).toStrictEqual({
    ...informacoesDuvidaSimples,
    primeiraMensagem: undefined,
  });

  expect(duvidaSegundaria.mensagens.length).toStrictEqual(1);
  expect(duvidaSegundaria.mensagens[0].mensagem).toStrictEqual(
    informacoesDuvidaSimples.primeiraMensagem
  );
  expect(duvidaSegundaria.mensagens[0].idPerfil).toStrictEqual(idPerfilAluno);
});

test('Adição de mensagens na primeira dúvida', async () => {
  const duvidasProjetoAntes = await obterDuvidas(projetoAuthToken);

  const mensagem =
    'Testando a iteração na dúvida por meio de mensagens no tópico';

  const result = await request(app)
    .put(duvidaEndpoint + '/' + duvidaAdicionada.id)
    .set(`Authorization`, `Bearer ${authTokenAluno}`)
    .send({
      mensagem: mensagem,
    });

  expect(result.statusCode).toStrictEqual(200);

  const duvidasProjetoDepois = await obterDuvidas(projetoAuthToken);

  expect(duvidasProjetoAntes.length).toStrictEqual(duvidasProjetoDepois.length);

  const duvidaPrincipalAtualizada = duvidasProjetoDepois.find(
    (duvida) => duvida.id === duvidaAdicionada.id
  );
  if (duvidaPrincipalAtualizada === undefined) throw Error('');
  expect(duvidaPrincipalAtualizada.mensagens.length).toStrictEqual(2);
  expect(duvidaPrincipalAtualizada.mensagens[0]).toStrictEqual(
    duvidaPrincipalAtualizada.mensagens[0]
  );
  expect(duvidaPrincipalAtualizada.mensagens[1].mensagem).toStrictEqual(
    mensagem
  );
  expect(duvidaPrincipalAtualizada.mensagens[1].idPerfil).toStrictEqual(
    idPerfilAluno
  );

  expect(duvidaPrincipalAtualizada.resolvida).toStrictEqual(false);
});

test('Fechar dúvida', async () => {
  const duvidasProjetoAntes = await obterDuvidas(projetoAuthToken);

  const result = await request(app)
    .put(duvidaEndpoint + '/' + duvidaAdicionada.id + '?fechar=true')
    .set(`Authorization`, `Bearer ${authTokenAluno}`);

  expect(result.statusCode).toStrictEqual(200);

  const duvidasProjetoDepois = await obterDuvidas(projetoAuthToken);

  expect(duvidasProjetoAntes.length).toStrictEqual(duvidasProjetoDepois.length);

  const duvidaPrincipalAtualizada = duvidasProjetoDepois.find(
    (duvida) => duvida.id === duvidaAdicionada.id
  );
  if (duvidaPrincipalAtualizada === undefined) throw Error('');
  expect(duvidaPrincipalAtualizada.mensagens[2].mensagem).toStrictEqual(
    'DÚVIDA FECHADA'
  );
  expect(duvidaPrincipalAtualizada.mensagens[2].idPerfil).toStrictEqual(
    idPerfilAluno
  );
  expect(duvidaPrincipalAtualizada.resolvida).toStrictEqual(true);
});

const signIn = async (
  email: string,
  password: string
): Promise<{ authToken: string; perfil: Perfil }> => {
  const authResult = await request(app).put(authEndpoint).send({
    email: email,
    password: password,
  });

  if (authResult.statusCode !== 200) {
    throw Error('Error sign in');
  }

  return {
    authToken: authResult.body['authToken'] as string,
    perfil: authResult.body['profile'] as Perfil,
  };
};

const registrarPerfil = async (
  informacoes: InformacoesRegistroPerfil,
  codigoDeEntrada?: string
): Promise<string> => {
  const result = await request(app)
    .post(authEndpoint)
    .send({ ...informacoes, codigoDeEntrada: codigoDeEntrada });

  if (result.statusCode !== 200) throw Error('');

  return result.body['authToken'] as string;
};

const registrarCodigoDeEntrada = async (
  informacoesCodigo: InformacoesCodigo
): Promise<string> => {
  const result = await request(app)
    .post(codigoDeEntradaEndpoint)
    .set(`Authorization`, `Bearer ${projetoAuthToken}`)
    .send(informacoesCodigo);

  if (result.statusCode !== 200) throw Error('');

  const codigo = result.body['codigo'] as CodigoDeEntrada;

  return codigo.id;
};

const obterDuvidas = async (
  authToken: string,
  idProjeto?: string
): Promise<Duvida[]> => {
  let endpoint: string = duvidaEndpoint;
  if (idProjeto !== undefined) {
    endpoint = endpoint + '?projeto=' + idProjeto;
  }
  const result = await request(app)
    .get(endpoint)
    .set(`Authorization`, `Bearer ${authToken}`);

  if (result.statusCode !== 200) throw Error('');

  const duvidas = result.body['duvidas'] as Duvida[];

  return duvidas;
};

type InformacoesRegistroPerfil = {
  email: string;
  password: string;
  nome: string;
  telefone: number;
  cpf: string;
};

type InformacoesCodigo =
  | {
      tipo: TipoCodigoDeEntrada.Professor;
      idCurso: string;
      idMateria: string;
    }
  | { tipo: TipoCodigoDeEntrada.Aluno; idCurso: string };
