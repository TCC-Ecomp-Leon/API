import request from 'supertest';
import app from '../src/app';
import environmentVariables from '../src/config/environmentVariables';
import { CursoUniversitario } from '../src/models';
import { backtrackObject, delay } from './utils';

const admEmail = 'tcc.ecomp.leon@gmail.com';
const admPassword = environmentVariables().ADM_PASSWORD;

const endpointCursoUniversitario = '/curso-universitario';
const authEndpoint = '/auth/sign/';

let admAuthToken: string;

let cursoRegistrado: CursoUniversitario;
let cursoRegistradoComAnterior: CursoUniversitario;

type InformacoesCursoUniversitario = Omit<
  CursoUniversitario,
  'id' | 'cursoAnterior'
> & {
  cursoAnterior: { id: string } | null;
};

const signIn = async (email: string, password: string): Promise<string> => {
  const authResult = await request(app).put(authEndpoint).send({
    email: email,
    password: password,
  });

  if (authResult.statusCode !== 200) {
    throw Error('Error sign in');
  }

  return authResult.body['authToken'];
};

beforeAll(async () => {
  admAuthToken = await signIn(admEmail, admPassword);
});

test('Envio de informações erradas no registro do curso', async () => {
  const informacoesCurso: InformacoesCursoUniversitario = {
    nome: 'Curso Universitario Teste',
    descricao: 'Testando',
    semestresPrevistos: 6,
    cursoAnterior: null,
  };
  const opcoesComErros = backtrackObject(informacoesCurso, true, false);
  for (let i = 0; i < opcoesComErros.length; i++) {
    const response = await request(app)
      .post(endpointCursoUniversitario)
      .set(`Authorization`, `Bearer ${admAuthToken}`)
      .send(opcoesComErros[i]);

    expect(response.statusCode).toStrictEqual(400);
  }
});

test('Registro de um curso sem curso anterior', async () => {
  const respostaCursosAntes = await request(app)
    .get(endpointCursoUniversitario)
    .set(`Authorization`, `Bearer ${admAuthToken}`);
  expect(respostaCursosAntes.statusCode).toStrictEqual(200);

  const cursosUniversitariosAntes = respostaCursosAntes.body[
    'cursosUniversitarios'
  ] as CursoUniversitario[];

  const informacoesCurso: InformacoesCursoUniversitario = {
    nome: 'Curso Universitario Teste',
    descricao: 'Testando',
    semestresPrevistos: 6,
    cursoAnterior: null,
  };

  const registroCurso = await request(app)
    .post(endpointCursoUniversitario)
    .set(`Authorization`, `Bearer ${admAuthToken}`)
    .send(informacoesCurso);

  expect(registroCurso.statusCode).toStrictEqual(200);

  const respostaCursosDepois = await request(app)
    .get(endpointCursoUniversitario)
    .set(`Authorization`, `Bearer ${admAuthToken}`);
  expect(respostaCursosDepois.statusCode).toStrictEqual(200);

  const cursosUniversitariosDepois = respostaCursosDepois.body[
    'cursosUniversitarios'
  ] as CursoUniversitario[];

  const idCursosAntes = cursosUniversitariosAntes.map((curso) => curso.id);
  const novosCursos = cursosUniversitariosDepois.filter(
    (curso) => !idCursosAntes.includes(curso.id)
  );

  expect(novosCursos.length).toStrictEqual(1);

  cursoRegistrado = novosCursos[0];
  expect({
    nome: cursoRegistrado.nome,
    descricao: cursoRegistrado.descricao,
    semestresPrevistos: cursoRegistrado.semestresPrevistos,
    cursoAnterior: cursoRegistrado.cursoAnterior,
  }).toStrictEqual(informacoesCurso);
});

test('Registro de um curso com curso anterior', async () => {
  const respostaCursosAntes = await request(app)
    .get(endpointCursoUniversitario)
    .set(`Authorization`, `Bearer ${admAuthToken}`);
  expect(respostaCursosAntes.statusCode).toStrictEqual(200);

  const cursosUniversitariosAntes = respostaCursosAntes.body[
    'cursosUniversitarios'
  ] as CursoUniversitario[];

  const informacoesCursoComAnterior: InformacoesCursoUniversitario = {
    nome: 'Curso Universitario com progressão Teste',
    descricao: 'Testando',
    semestresPrevistos: 4,
    cursoAnterior: {
      id: cursoRegistrado.id,
    },
  };

  const registroCursoComAnterior = await request(app)
    .post(endpointCursoUniversitario)
    .set(`Authorization`, `Bearer ${admAuthToken}`)
    .send(informacoesCursoComAnterior);

  expect(registroCursoComAnterior.statusCode).toStrictEqual(200);

  const respostaCursosDepois = await request(app)
    .get(endpointCursoUniversitario)
    .set(`Authorization`, `Bearer ${admAuthToken}`);
  expect(respostaCursosDepois.statusCode).toStrictEqual(200);

  const cursosUniversitariosDepois = respostaCursosDepois.body[
    'cursosUniversitarios'
  ] as CursoUniversitario[];

  const idCursosAntes = cursosUniversitariosAntes.map((curso) => curso.id);
  const novosCursos = cursosUniversitariosDepois.filter(
    (curso) => !idCursosAntes.includes(curso.id)
  );
  expect(novosCursos.length).toStrictEqual(1);

  cursoRegistradoComAnterior = novosCursos[0];
  expect({
    nome: cursoRegistradoComAnterior.nome,
    descricao: cursoRegistradoComAnterior.descricao,
    semestresPrevistos: cursoRegistradoComAnterior.semestresPrevistos,
    cursoAnterior: undefined,
  }).toStrictEqual({
    ...informacoesCursoComAnterior,
    cursoAnterior: undefined,
  });
  expect(cursoRegistradoComAnterior.cursoAnterior).toStrictEqual(
    cursoRegistrado
  );
});

test('Atualização do curso anterior de um curso', async () => {
  const respostaRemocaoCursoAnterior = await request(app)
    .put(endpointCursoUniversitario + '/' + cursoRegistradoComAnterior.id)
    .set(`Authorization`, `Bearer ${admAuthToken}`)
    .send({ cursoAnterior: null });
  expect(respostaRemocaoCursoAnterior.statusCode).toStrictEqual(200);

  const respostaCursosDepois = await request(app)
    .get(endpointCursoUniversitario)
    .set(`Authorization`, `Bearer ${admAuthToken}`);
  expect(respostaCursosDepois.statusCode).toStrictEqual(200);

  const cursosUniversitariosDepois = respostaCursosDepois.body[
    'cursosUniversitarios'
  ] as CursoUniversitario[];
  let cursoAtualizado = cursosUniversitariosDepois.find(
    (curso) => curso.id === cursoRegistradoComAnterior.id
  );
  if (cursoAtualizado === undefined) throw Error('');

  expect({
    ...cursoAtualizado,
    cursoAnterior: undefined,
  }).toStrictEqual({
    ...cursoRegistradoComAnterior,
    cursoAnterior: undefined,
  });
  expect(cursoAtualizado.cursoAnterior).toBe(null);

  const respostaAdicaoCursoAnterior = await request(app)
    .put(endpointCursoUniversitario + '/' + cursoRegistradoComAnterior.id)
    .set(`Authorization`, `Bearer ${admAuthToken}`)
    .send({ cursoAnterior: { id: cursoRegistrado.id } });
  expect(respostaAdicaoCursoAnterior.statusCode).toStrictEqual(200);

  const respostaCursosDepois2 = await request(app)
    .get(endpointCursoUniversitario)
    .set(`Authorization`, `Bearer ${admAuthToken}`);
  expect(respostaCursosDepois2.statusCode).toStrictEqual(200);

  const cursosUniversitariosDepois2 = respostaCursosDepois2.body[
    'cursosUniversitarios'
  ] as CursoUniversitario[];
  cursoAtualizado = cursosUniversitariosDepois2.find(
    (curso) => curso.id === cursoRegistradoComAnterior.id
  );
  if (cursoAtualizado === undefined) throw Error('');
  expect(cursoAtualizado).toStrictEqual(cursoRegistradoComAnterior);
});

test('Remoção de um curso que é curso anterior', async () => {
  const respostaRemocaoCursoQueEhAnterior = await request(app)
    .delete(endpointCursoUniversitario + '/' + cursoRegistrado.id)
    .set(`Authorization`, `Bearer ${admAuthToken}`);
  expect(respostaRemocaoCursoQueEhAnterior.statusCode).toStrictEqual(200);

  const respostaCursosDepois = await request(app)
    .get(endpointCursoUniversitario)
    .set(`Authorization`, `Bearer ${admAuthToken}`);
  expect(respostaCursosDepois.statusCode).toStrictEqual(200);

  const cursosUniversitariosDepois = respostaCursosDepois.body[
    'cursosUniversitarios'
  ] as CursoUniversitario[];
  expect(
    cursosUniversitariosDepois.find((curso) => curso.id === cursoRegistrado.id)
  ).toStrictEqual(undefined);
  let cursoAtualizado = cursosUniversitariosDepois.find(
    (curso) => curso.id === cursoRegistradoComAnterior.id
  );
  if (cursoAtualizado === undefined) throw Error('');
  expect(cursoAtualizado.cursoAnterior).toStrictEqual(null);
});

test('Remoção do segungo curso adicionado', async () => {
  const respostaRemocaoCurso = await request(app)
    .delete(endpointCursoUniversitario + '/' + cursoRegistradoComAnterior.id)
    .set(`Authorization`, `Bearer ${admAuthToken}`);
  expect(respostaRemocaoCurso.statusCode).toStrictEqual(200);

  const respostaCursosDepois = await request(app)
    .get(endpointCursoUniversitario)
    .set(`Authorization`, `Bearer ${admAuthToken}`);
  expect(respostaCursosDepois.statusCode).toStrictEqual(200);

  const cursosUniversitariosDepois = respostaCursosDepois.body[
    'cursosUniversitarios'
  ] as CursoUniversitario[];
  expect(
    cursosUniversitariosDepois.find((curso) => curso.id === cursoRegistrado.id)
  ).toStrictEqual(undefined);
  expect(
    cursosUniversitariosDepois.find(
      (curso) => curso.id === cursoRegistradoComAnterior.id
    )
  ).toStrictEqual(undefined);
});
