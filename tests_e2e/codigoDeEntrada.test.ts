import request from 'supertest';
import app from '../src/app';
import {
  CodigoDeEntrada,
  Perfil,
  Projeto,
  RegraPerfil,
  TipoCodigoDeEntrada,
} from '../src/models';
import environmentVariables from '../src/config/environmentVariables';
import { backtrackObject, delay } from './utils';
import { v4 as uuid } from 'uuid';

const emailProjeto = 'projeto@test.com';
const senhaProjeto = 'projeto@test';

const emailUsuarioTest = 'user1@test.com';
const senhaUsuarioTest = 'user1@test';

const admEmail = 'tcc.ecomp.leon@gmail.com';
const admPassword = environmentVariables().ADM_PASSWORD;

const codigoDeEntradaEndpoint = '/codigo-de-entrada';
const authEndpoint = '/auth/sign/';
const projetosEndpoint = '/projeto';
const profileEndpoint = '/profile';

let projetoAuthToken: string;
let admAuthToken: string;
let userAuthToken: string;

let projeto: Projeto & { aprovado: true };

let userPerfil: Perfil;

let idCodigoAdicionadoAluno: string;
let idCodigoAdicionadoProfessor: string;

type InformacoesCodigo =
  | {
      tipo: TipoCodigoDeEntrada.Professor;
      idCurso: string;
      idMateria: string;
    }
  | { tipo: TipoCodigoDeEntrada.Aluno; idCurso: string };

beforeAll(async () => {
  const authResult = await request(app).put(authEndpoint).send({
    email: emailProjeto,
    password: senhaProjeto,
  });

  if (authResult.statusCode !== 200) {
    throw Error('Error sign in');
  }

  projetoAuthToken = authResult.body['authToken'];

  projeto = await getProjeto();

  const admAuthResult = await request(app).put(authEndpoint).send({
    email: admEmail,
    password: admPassword,
  });

  if (admAuthResult.statusCode !== 200) {
    throw Error('Error sign in');
  }

  admAuthToken = admAuthResult.body['authToken'];

  const userAuthResult = await request(app).put(authEndpoint).send({
    email: emailUsuarioTest,
    password: senhaUsuarioTest,
  });

  if (userAuthResult.statusCode !== 200) {
    throw Error('Error sign in');
  }

  userAuthToken = userAuthResult.body['authToken'];
  userPerfil = userAuthResult.body['profile'] as Perfil;
});

const getProjeto = async (): Promise<Projeto & { aprovado: true }> => {
  const response = await request(app)
    .get(projetosEndpoint + '?email=' + emailProjeto)
    .set(`Authorization`, `Bearer ${projetoAuthToken}`);

  if (response.statusCode !== 200) {
    throw Error('Error getting the project');
  }

  const projeto = (response.body['projetos'] as Projeto[])[0];

  if (!projeto.aprovado) {
    throw Error('Projeto não aprovado');
  }

  return projeto;
};

test('Criação e deleção de códigos de entrada aluno e professor', async () => {
  const respostaListaCodigosAntesProjeto = await request(app)
    .get(codigoDeEntradaEndpoint)
    .set(`Authorization`, `Bearer ${projetoAuthToken}`);
  expect(respostaListaCodigosAntesProjeto.statusCode).toStrictEqual(200);
  const codigosProjetoAntes = respostaListaCodigosAntesProjeto.body[
    'codigos'
  ] as CodigoDeEntrada[];

  const respostaListaCodigosAntesAdm = await request(app)
    .get(codigoDeEntradaEndpoint)
    .set(`Authorization`, `Bearer ${admAuthToken}`);
  expect(respostaListaCodigosAntesAdm.statusCode).toStrictEqual(200);
  const todosCodigosAntes = respostaListaCodigosAntesProjeto.body[
    'codigos'
  ] as CodigoDeEntrada[];

  const codigoAluno: InformacoesCodigo = {
    tipo: TipoCodigoDeEntrada.Aluno,
    idCurso: projeto.cursos[0].id,
  };

  const codigoProfessor: InformacoesCodigo = {
    tipo: TipoCodigoDeEntrada.Professor,
    idCurso: projeto.cursos[0].id,
    idMateria: projeto.cursos[0].materias[0].id,
  };

  const opcoesComErrosAluno = backtrackObject(codigoAluno, true, false);

  for (let i = 0; i < opcoesComErrosAluno.length; i++) {
    const response = await request(app)
      .post(codigoDeEntradaEndpoint)
      .set(`Authorization`, `Bearer ${projetoAuthToken}`)
      .send(opcoesComErrosAluno[i]);

    expect(response.statusCode).toStrictEqual(400);
  }

  const opcoesComErrosProfessor = backtrackObject(codigoProfessor, true, false);

  for (let i = 0; i < opcoesComErrosProfessor.length; i++) {
    const response = await request(app)
      .post(codigoDeEntradaEndpoint)
      .set(`Authorization`, `Bearer ${projetoAuthToken}`)
      .send(opcoesComErrosProfessor[i]);

    expect(response.statusCode).toStrictEqual(400);
  }

  const registroCodigoAlunoErroCurso = await request(app)
    .post(codigoDeEntradaEndpoint)
    .set(`Authorization`, `Bearer ${projetoAuthToken}`)
    .send({
      ...codigoAluno,
      idCurso: uuid(),
    });

  expect(registroCodigoAlunoErroCurso.statusCode).toStrictEqual(404);

  const registroCodigoProfessorComErroCurso = await request(app)
    .post(codigoDeEntradaEndpoint)
    .set(`Authorization`, `Bearer ${projetoAuthToken}`)
    .send({
      ...codigoProfessor,
      idCurso: uuid(),
    });

  expect(registroCodigoProfessorComErroCurso.statusCode).toStrictEqual(404);

  const registroCodigoProfessorComErroMateria = await request(app)
    .post(codigoDeEntradaEndpoint)
    .set(`Authorization`, `Bearer ${projetoAuthToken}`)
    .send({
      ...codigoProfessor,
      idMateria: uuid(),
    });

  expect(registroCodigoProfessorComErroMateria.statusCode).toStrictEqual(404);

  const registroCodigoAluno = await request(app)
    .post(codigoDeEntradaEndpoint)
    .set(`Authorization`, `Bearer ${projetoAuthToken}`)
    .send(codigoAluno);

  expect(registroCodigoAluno.statusCode).toStrictEqual(200);

  const novoCodigoAluno = registroCodigoAluno.body['codigo'] as CodigoDeEntrada;
  idCodigoAdicionadoAluno = novoCodigoAluno.id;

  const registroCodigoProfessor = await request(app)
    .post(codigoDeEntradaEndpoint)
    .set(`Authorization`, `Bearer ${projetoAuthToken}`)
    .send(codigoProfessor);

  expect(registroCodigoProfessor.statusCode).toStrictEqual(200);

  const novoCodigoProfessor = registroCodigoProfessor.body[
    'codigo'
  ] as CodigoDeEntrada;
  idCodigoAdicionadoProfessor = novoCodigoProfessor.id;

  const respostaListaCodigosDepoisProjeto = await request(app)
    .get(codigoDeEntradaEndpoint)
    .set(`Authorization`, `Bearer ${projetoAuthToken}`);
  expect(respostaListaCodigosDepoisProjeto.statusCode).toStrictEqual(200);
  const codigosProjetoDepois = respostaListaCodigosDepoisProjeto.body[
    'codigos'
  ] as CodigoDeEntrada[];

  const respostaListaCodigosDepoisAdm = await request(app)
    .get(codigoDeEntradaEndpoint)
    .set(`Authorization`, `Bearer ${admAuthToken}`);
  expect(respostaListaCodigosDepoisAdm.statusCode).toStrictEqual(200);
  const todosCodigosDepois = respostaListaCodigosDepoisAdm.body[
    'codigos'
  ] as CodigoDeEntrada[];

  expect(
    todosCodigosDepois.length - todosCodigosAntes.length
  ).toBeGreaterThanOrEqual(2);
  expect(
    codigosProjetoDepois.length - codigosProjetoAntes.length
  ).toStrictEqual(2);
});

test('Uso em um perfil já registrado do código de entrada de aluno e professor', async () => {
  const respostaUsoCodigoAluno = await request(app)
    .put(codigoDeEntradaEndpoint + '/' + idCodigoAdicionadoAluno)
    .set(`Authorization`, `Bearer ${userAuthToken}`);

  expect(respostaUsoCodigoAluno.statusCode).toStrictEqual(200);

  const respostaPerfilAtualizadoAluno = await request(app)
    .get(profileEndpoint)
    .set(`Authorization`, `Bearer ${userAuthToken}`);

  expect(respostaPerfilAtualizadoAluno.statusCode).toStrictEqual(200);

  const perfilUsuarioComoAluno = respostaPerfilAtualizadoAluno.body[
    'profile'
  ] as Perfil;

  expect(perfilUsuarioComoAluno.regra).toStrictEqual(RegraPerfil.Geral);
  if (perfilUsuarioComoAluno.regra !== RegraPerfil.Geral) {
    throw Error('');
  }
  expect(perfilUsuarioComoAluno.associacoes.aluno.alunoParceiro).toStrictEqual(
    true
  );
  if (!perfilUsuarioComoAluno.associacoes.aluno.alunoParceiro) {
    throw Error('');
  }
  expect(perfilUsuarioComoAluno.associacoes.aluno.cursos.length).toStrictEqual(
    1
  );
  expect(perfilUsuarioComoAluno.associacoes.aluno.cursos[0].id).toStrictEqual(
    projeto.cursos[0].id
  );

  const respostaUsoCodigoProfessor = await request(app)
    .put(codigoDeEntradaEndpoint + '/' + idCodigoAdicionadoProfessor)
    .set(`Authorization`, `Bearer ${userAuthToken}`);

  expect(respostaUsoCodigoProfessor.statusCode).toStrictEqual(200);

  const respostaPerfilAtualizadoProfessor = await request(app)
    .get(profileEndpoint)
    .set(`Authorization`, `Bearer ${userAuthToken}`);

  expect(respostaPerfilAtualizadoProfessor.statusCode).toStrictEqual(200);

  const perfilUsuarioComoProfessor = respostaPerfilAtualizadoProfessor.body[
    'profile'
  ] as Perfil;

  expect(perfilUsuarioComoProfessor.regra).toStrictEqual(RegraPerfil.Geral);
  if (perfilUsuarioComoProfessor.regra !== RegraPerfil.Geral) {
    throw Error('');
  }
  expect(
    perfilUsuarioComoProfessor.associacoes.professor.professor
  ).toStrictEqual(true);
  if (!perfilUsuarioComoProfessor.associacoes.professor.professor) {
    throw Error('');
  }
  expect(
    perfilUsuarioComoProfessor.associacoes.professor.materiasProfessor.length
  ).toStrictEqual(1);
  expect(
    perfilUsuarioComoProfessor.associacoes.professor.materiasProfessor[0].id
  ).toStrictEqual(projeto.cursos[0].materias[0].id);
});

// test('Remoção de um código de entrada', async () => {
//   const respostaListaCodigosAntesProjeto = await request(app)
//     .get(codigoDeEntradaEndpoint)
//     .set(`Authorization`, `Bearer ${projetoAuthToken}`);
//   expect(respostaListaCodigosAntesProjeto.statusCode).toStrictEqual(200);
//   const codigosProjetoAntes = respostaListaCodigosAntesProjeto.body[
//     'codigos'
//   ] as CodigoDeEntrada[];

//   const respostaListaCodigosAntesAdm = await request(app)
//     .get(codigoDeEntradaEndpoint)
//     .set(`Authorization`, `Bearer ${admAuthToken}`);
//   expect(respostaListaCodigosAntesAdm.statusCode).toStrictEqual(200);
//   const todosCodigosAntes = respostaListaCodigosAntesProjeto.body[
//     'codigos'
//   ] as CodigoDeEntrada[];

//   const remocaoCodigoAluno = await request(app)
//     .delete(codigoDeEntradaEndpoint + '/' + idCodigoAdicionadoAluno)
//     .set(`Authorization`, `Bearer ${projetoAuthToken}`);
//   expect(remocaoCodigoAluno.statusCode).toStrictEqual(200);

//   const remocaoCodigoProfessor = await request(app)
//     .delete(codigoDeEntradaEndpoint + '/' + idCodigoAdicionadoProfessor)
//     .set(`Authorization`, `Bearer ${projetoAuthToken}`);
//   expect(remocaoCodigoProfessor.statusCode).toStrictEqual(200);

//   const respostaListaCodigosDepoisProjeto = await request(app)
//     .get(codigoDeEntradaEndpoint)
//     .set(`Authorization`, `Bearer ${projetoAuthToken}`);
//   expect(respostaListaCodigosDepoisProjeto.statusCode).toStrictEqual(200);
//   const codigosProjetoDepois = respostaListaCodigosDepoisProjeto.body[
//     'codigos'
//   ] as CodigoDeEntrada[];

//   const respostaListaCodigosDepoisAdm = await request(app)
//     .get(codigoDeEntradaEndpoint)
//     .set(`Authorization`, `Bearer ${admAuthToken}`);
//   expect(respostaListaCodigosDepoisAdm.statusCode).toStrictEqual(200);
//   const todosCodigosDepois = respostaListaCodigosDepoisAdm.body[
//     'codigos'
//   ] as CodigoDeEntrada[];

//   expect(
//     todosCodigosAntes.length - todosCodigosDepois.length
//   ).toBeGreaterThanOrEqual(2);
//   expect(
//     codigosProjetoAntes.length - codigosProjetoDepois.length
//   ).toBeGreaterThanOrEqual(2);
// });
