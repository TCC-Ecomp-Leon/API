import { addDays, subDays } from 'date-fns';
import request from 'supertest';
import app from '../src/app';
import {
  Atividade,
  CodigoDeEntrada,
  Perfil,
  TipoAtividade,
  TipoCodigoDeEntrada,
} from '../src/models';
import { InformacoesAtividade } from '../src/schemas/atividade';

let projetoAuthToken: string;
let alunoAuthToken: string;
let universitarioAuthToken: string;

const emailProjeto = 'projeto3@test.com';
const senhaProjeto = 'projeto3@test';

const emailAluno = 'aluno2@test.com';
const senhaAluno = 'aluno2@test';

const emailUniversitario = 'universitario2@unifesp.br';
const senhaUniversitario = 'universitario2@unifesp';

const authEndpoint = '/auth/sign/';
const codigoDeEntradaEndpoint = '/codigo-de-entrada';
const atividadeEndpoint = '/atividade';

const idProjeto = '71bcad70-6fb5-4de4-bd45-02a2b8cb7864';
const idCurso = 'f8328156-9106-4e84-a99d-eff3f09ed273';

const informacoesCodigoDeEntradaAluno: InformacoesCodigo = {
  tipo: TipoCodigoDeEntrada.Aluno,
  idCurso: idCurso,
};

const informacoesAluno: InformacoesRegistroPerfil = {
  email: emailAluno,
  password: senhaAluno,
  nome: 'Aluno teste dúvidas',
  telefone: 12,
  cpf: 'YYYYYYYY',
};

const atividadesRegistradas: Atividade[] = [];

beforeAll(async () => {
  projetoAuthToken = (await signIn(emailProjeto, senhaProjeto)).authToken;
  const idCodigoDeEntrada = await registrarCodigoDeEntrada(
    informacoesCodigoDeEntradaAluno
  );
  alunoAuthToken = await registrarPerfil(informacoesAluno, idCodigoDeEntrada);

  universitarioAuthToken = (
    await signIn(emailUniversitario, senhaUniversitario)
  ).authToken;
});

test('Registro de uma atividade alternativa', async () => {
  const atividadesAntesProjeto = await obterListaAtividades(
    projetoAuthToken,
    undefined,
    undefined,
    undefined,
    undefined
  );

  const informacoes: InformacoesAtividade & {
    tipo: TipoAtividade.Alternativa;
  } = {
    tipo: TipoAtividade.Alternativa,
    nome: 'Atividade alternativa teste',
    idProjeto: idProjeto,
    idCurso: idCurso,
    idMateria: null,
    aberturaRespostas: subDays(new Date(), 1) as any as string,
    fechamentoRespostas: addDays(new Date(), 1) as any as string,
    notaReferencia: 10,
    questoes: [
      {
        enunciado: 'Teste questão 1',
        peso: 1,
        alternativas: [
          {
            item: 'a) Teste de alternativa a',
            value: true,
          },
          {
            item: 'b) Teste de alternativa b',
            value: false,
          },
          {
            item: 'c) Teste de alternativa c',
            value: false,
          },
          {
            item: 'd) Teste de alternativa d',
            value: false,
          },
        ],
      },
    ],
  };

  const resultadoRegistro = await request(app)
    .post(atividadeEndpoint)
    .set(`Authorization`, `Bearer ${projetoAuthToken}`)
    .send(informacoes);

  expect(resultadoRegistro.statusCode).toStrictEqual(200);

  const atividadeRegistrada = resultadoRegistro.body['atividade'] as Atividade;
  if (atividadeRegistrada.tipoAtividade !== TipoAtividade.Alternativa)
    throw Error('');
  expect({
    tipo: atividadeRegistrada.tipoAtividade,
    nome: atividadeRegistrada.nome,
    idProjeto: atividadeRegistrada.idProjeto,
    idCurso: atividadeRegistrada.idCurso,
    idMateria: atividadeRegistrada.idMateria,
    aberturaRespostas: new Date(atividadeRegistrada.aberturaRespostas),
    fechamentoRespostas: new Date(atividadeRegistrada.fechamentoRespostas),
    notaReferencia: atividadeRegistrada.notaReferencia,
    questoes: atividadeRegistrada.itens.map((item) => ({
      ...item,
      idQuestao: undefined,
    })),
  }).toStrictEqual({
    ...informacoes,
    aberturaRespostas: new Date(informacoes.aberturaRespostas),
    fechamentoRespostas: new Date(informacoes.fechamentoRespostas),
    questoes: informacoes.questoes.map((item) => ({
      ...item,
      idQuestao: undefined,
    })),
  });
  atividadesRegistradas.push(atividadeRegistrada);

  const atividadesDepoisProjeto = await obterListaAtividades(
    projetoAuthToken,
    undefined,
    undefined,
    undefined,
    undefined
  );
  expect(
    atividadesDepoisProjeto.length - atividadesAntesProjeto.length
  ).toStrictEqual(1);

  const idAtividadesAntes = atividadesAntesProjeto.map(
    (atividade) => atividade.id
  );
  const novaAtividade = atividadesDepoisProjeto.find(
    (atividade) => !idAtividadesAntes.includes(atividade.id)
  );
  expect(novaAtividade !== undefined).toBe(true);
  if (novaAtividade === undefined) throw Error('');
  expect(novaAtividade).toStrictEqual(atividadeRegistrada);
});

test('Registro de uma atividade dissertativa', async () => {
  const atividadesAntesProjeto = await obterListaAtividades(
    projetoAuthToken,
    undefined,
    undefined,
    undefined,
    undefined
  );

  const informacoes: InformacoesAtividade & {
    tipo: TipoAtividade.Dissertativa;
  } = {
    tipo: TipoAtividade.Dissertativa,
    nome: 'Atividade alternativa teste',
    idProjeto: idProjeto,
    idCurso: idCurso,
    idMateria: null,
    aberturaRespostas: subDays(new Date(), 1) as any as string,
    fechamentoRespostas: addDays(new Date(), 1) as any as string,
    fechamentoCorrecoes: addDays(new Date(), 2) as any as string,
    tempoColaboracao: 2,
    notaReferencia: 10,
    questoes: [
      {
        enunciado: 'Teste questão 1',
        peso: 1,
        respostaEsperada: {
          foto: false,
          texto: 'Testando',
        },
      },
      {
        enunciado: 'Teste questão 2',
        peso: 1,
        respostaEsperada: {
          foto: true,
          imagem: 'base64 image',
        },
      },
    ],
  };

  const resultadoRegistro = await request(app)
    .post(atividadeEndpoint)
    .set(`Authorization`, `Bearer ${projetoAuthToken}`)
    .send(informacoes);

  expect(resultadoRegistro.statusCode).toStrictEqual(200);

  const atividadeRegistrada = resultadoRegistro.body['atividade'] as Atividade;
  if (atividadeRegistrada.tipoAtividade !== TipoAtividade.Dissertativa)
    throw Error('');
  expect({
    tipo: atividadeRegistrada.tipoAtividade,
    nome: atividadeRegistrada.nome,
    idProjeto: atividadeRegistrada.idProjeto,
    idCurso: atividadeRegistrada.idCurso,
    idMateria: atividadeRegistrada.idMateria,
    aberturaRespostas: new Date(atividadeRegistrada.aberturaRespostas),
    fechamentoRespostas: new Date(atividadeRegistrada.fechamentoRespostas),
    fechamentoCorrecoes: new Date(atividadeRegistrada.fechamentoCorrecoes),
    tempoColaboracao: atividadeRegistrada.tempoColaboracao,
    notaReferencia: atividadeRegistrada.notaReferencia,
    questoes: atividadeRegistrada.itens.map((item) => ({
      ...item,
      idQuestao: undefined,
    })),
  }).toStrictEqual({
    ...informacoes,
    aberturaRespostas: new Date(informacoes.aberturaRespostas),
    fechamentoRespostas: new Date(informacoes.fechamentoRespostas),
    questoes: informacoes.questoes.map((item) => ({
      ...item,
      idQuestao: undefined,
    })),
  });
  atividadesRegistradas.push(atividadeRegistrada);

  const atividadesDepoisProjeto = await obterListaAtividades(
    projetoAuthToken,
    undefined,
    undefined,
    undefined,
    undefined
  );
  expect(
    atividadesDepoisProjeto.length - atividadesAntesProjeto.length
  ).toStrictEqual(1);

  const idAtividadesAntes = atividadesAntesProjeto.map(
    (atividade) => atividade.id
  );
  const novaAtividade = atividadesDepoisProjeto.find(
    (atividade) => !idAtividadesAntes.includes(atividade.id)
  );
  expect(novaAtividade !== undefined).toBe(true);
  if (novaAtividade === undefined) throw Error('');
  expect(novaAtividade).toStrictEqual(atividadeRegistrada);
});

test('Registro de uma atividade de banco de questões', async () => {
  const atividadesAntesProjeto = await obterListaAtividades(
    projetoAuthToken,
    undefined,
    undefined,
    undefined,
    undefined
  );

  const informacoes: InformacoesAtividade & {
    tipo: TipoAtividade.BancoDeQuestoes;
  } = {
    tipo: TipoAtividade.BancoDeQuestoes,
    nome: 'Atividade alternativa teste',
    idProjeto: idProjeto,
    idCurso: idCurso,
    idMateria: null,
    aberturaRespostas: subDays(new Date(), 1) as any as string,
    fechamentoRespostas: addDays(new Date(), 1) as any as string,
    tempoColaboracao: 2,
    assuntos: ['Matemática', 'Física'],
  };

  const resultadoRegistro = await request(app)
    .post(atividadeEndpoint)
    .set(`Authorization`, `Bearer ${projetoAuthToken}`)
    .send(informacoes);

  expect(resultadoRegistro.statusCode).toStrictEqual(200);

  const atividadeRegistrada = resultadoRegistro.body['atividade'] as Atividade;
  if (atividadeRegistrada.tipoAtividade !== TipoAtividade.BancoDeQuestoes)
    throw Error('');
  expect({
    tipo: atividadeRegistrada.tipoAtividade,
    nome: atividadeRegistrada.nome,
    idProjeto: atividadeRegistrada.idProjeto,
    idCurso: atividadeRegistrada.idCurso,
    idMateria: atividadeRegistrada.idMateria,
    aberturaRespostas: new Date(atividadeRegistrada.aberturaRespostas),
    fechamentoRespostas: new Date(atividadeRegistrada.fechamentoRespostas),
    tempoColaboracao: atividadeRegistrada.tempoColaboracao,
    assuntos: atividadeRegistrada.assuntos,
  }).toStrictEqual({
    ...informacoes,
    aberturaRespostas: new Date(informacoes.aberturaRespostas),
    fechamentoRespostas: new Date(informacoes.fechamentoRespostas),
  });
  atividadesRegistradas.push(atividadeRegistrada);

  const atividadesDepoisProjeto = await obterListaAtividades(
    projetoAuthToken,
    undefined,
    undefined,
    undefined,
    undefined
  );
  expect(
    atividadesDepoisProjeto.length - atividadesAntesProjeto.length
  ).toStrictEqual(1);

  const idAtividadesAntes = atividadesAntesProjeto.map(
    (atividade) => atividade.id
  );
  const novaAtividade = atividadesDepoisProjeto.find(
    (atividade) => !idAtividadesAntes.includes(atividade.id)
  );
  expect(novaAtividade !== undefined).toBe(true);
  if (novaAtividade === undefined) throw Error('');
  expect(novaAtividade).toStrictEqual(atividadeRegistrada);
});

test('Listagem de atividades de um projeto e curso', async () => {
  const todasAtividades = await obterListaAtividades(
    projetoAuthToken,
    undefined,
    undefined,
    undefined,
    undefined
  );
  const atividadesProjeto = await obterListaAtividades(
    projetoAuthToken,
    idProjeto,
    undefined,
    undefined,
    undefined
  );
  const atividadesCurso = await obterListaAtividades(
    projetoAuthToken,
    undefined,
    idCurso,
    undefined,
    undefined
  );
  const todasAtividadesAbertas = await obterListaAtividades(
    projetoAuthToken,
    undefined,
    undefined,
    undefined,
    true
  );

  expect(todasAtividades).toStrictEqual(atividadesProjeto);
  expect(todasAtividades).toStrictEqual(atividadesCurso);
  expect(todasAtividades).toStrictEqual(todasAtividadesAbertas);
});

const obterListaAtividades = async (
  authToken: string,
  idProjeto: string | undefined,
  idCurso: string | undefined,
  idMateria: string | undefined,
  abertas: boolean | undefined
): Promise<Atividade[]> => {
  const responde = await request(app)
    .get(atividadeEndpoint)
    .set(`Authorization`, `Bearer ${authToken}`)
    .query(idProjeto !== undefined ? { projeto: idProjeto } : {})
    .query(idCurso !== undefined ? { curso: idCurso } : {})
    .query(idMateria !== undefined ? { materia: idMateria } : {})
    .query(abertas !== undefined ? { abertas: abertas } : {});

  expect(responde.statusCode).toStrictEqual(200);
  if (responde.statusCode !== 200) {
    throw Error('');
  }

  const atividades = responde.body['atividades'] as Atividade[];
  return atividades;
};

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
