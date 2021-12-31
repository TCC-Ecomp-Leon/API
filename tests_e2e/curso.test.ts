import request from 'supertest';
import app from '../src/app';
import { Curso, Projeto } from '../src/models';
import { backtrackObject, delay } from './utils';

jest.setTimeout(100000);

const authEndpoint = '/auth/sign/';
const projetosEndpoint = '/projeto';
const cursosEndpoint = '/cursos';

const emailProjeto = 'projeto@test.com';
const senhaProjeto = 'projeto@test';

let projetoAuthToken: string;
let projetoAprovado: Projeto;
let cursoAdicionado: Curso;

beforeAll(async () => {
  const authResult = await request(app).put(authEndpoint).send({
    email: emailProjeto,
    password: senhaProjeto,
  });

  if (authResult.statusCode !== 200) {
    throw Error('Error sign in');
  }

  projetoAuthToken = authResult.body['authToken'];

  projetoAprovado = await getProjeto();
});

const getProjeto = async (): Promise<Projeto> => {
  const response = await request(app)
    .get(projetosEndpoint + '?email=' + emailProjeto)
    .set(`Authorization`, `Bearer ${projetoAuthToken}`);

  if (response.statusCode !== 200) {
    throw Error('Error getting the project');
  }

  const projeto = (response.body['projetos'] as Projeto[])[0];

  return projeto;
};

test('Adição de um novo curso', async () => {
  const camposObrigatorios: Omit<
    Curso,
    'id' | 'atualizadoEm' | 'idProjeto' | 'turma'
  > = {
    nome: 'ADIÇÃO DE CURSO',
    descricao: 'TESTE ADIÇÃO DE CURSO',
    inicioCurso: new Date(),
    fimCurso: new Date(),
    materias: [],
  };

  const opcoesComErros = backtrackObject(camposObrigatorios, true, false);

  for (let i = 0; i < opcoesComErros.length; i++) {
    const response = await request(app)
      .post(cursosEndpoint + '/' + projetoAprovado.id)
      .set(`Authorization`, `Bearer ${projetoAuthToken}`)
      .send(opcoesComErros[i]);

    expect(response.statusCode).toStrictEqual(400);
  }

  const response = await request(app)
    .post(cursosEndpoint + '/' + projetoAprovado.id)
    .set(`Authorization`, `Bearer ${projetoAuthToken}`)
    .send(camposObrigatorios);

  expect(response.statusCode).toStrictEqual(200);

  const projetoComCurso = await getProjeto();

  if (!projetoAprovado.aprovado || !projetoComCurso.aprovado) {
    throw Error('Projeto não aprovado');
  }

  expect(
    projetoComCurso.cursos.length - projetoAprovado.cursos.length
  ).toStrictEqual(1);

  const novosCursos = projetoComCurso.cursos.filter((curso) => {
    if (!projetoAprovado.aprovado) throw Error();

    const idsAnteriores = projetoAprovado.cursos.map((curso) => curso.id);

    return !idsAnteriores.includes(curso.id);
  });

  expect(novosCursos.length).toStrictEqual(1);

  cursoAdicionado = {
    ...novosCursos[0],
    inicioCurso: new Date(novosCursos[0].inicioCurso),
    fimCurso: new Date(novosCursos[0].fimCurso),
  };

  expect({
    nome: cursoAdicionado.nome,
    descricao: cursoAdicionado.descricao,
    inicioCurso: cursoAdicionado.inicioCurso,
    fimCurso: cursoAdicionado.fimCurso,
    materias: cursoAdicionado.materias,
  }).toStrictEqual(camposObrigatorios);
});

test('Atualização de curso', async () => {
  const camposOpcionais: Omit<
    Curso,
    'id' | 'atualizadoEm' | 'idProjeto' | 'turma'
  > = {
    nome: 'ATUALIZAÇÃO DE CURSO',
    descricao: 'TESTE ATUALIZAÇÃO DE CURSO',
    inicioCurso: new Date(),
    fimCurso: new Date(),
    materias: [],
  };

  const opcoesParciais = backtrackObject(camposOpcionais, true, true);
  let cursoAtualizado = { ...cursoAdicionado };

  for (let i = 0; i < opcoesParciais.length; i++) {
    const horarioAntesAtualizacao = new Date();

    const camposAtualizar = opcoesParciais[i];

    cursoAtualizado = {
      ...cursoAtualizado,
      ...camposAtualizar,
    };

    const responseAtualizacaoCurso = await request(app)
      .put(cursosEndpoint + '/' + projetoAprovado.id + '/' + cursoAdicionado.id)
      .set(`Authorization`, `Bearer ${projetoAuthToken}`)
      .send(camposAtualizar);

    expect(responseAtualizacaoCurso.statusCode).toStrictEqual(200);

    const projetoAtualizado = await getProjeto();

    if (!projetoAtualizado.aprovado) {
      throw Error();
    }

    const cursoAposAtualizacao = projetoAtualizado.cursos.find(
      (curso) => curso.id === cursoAdicionado.id
    );

    if (
      cursoAposAtualizacao === undefined ||
      cursoAposAtualizacao.atualizadoEm === undefined
    ) {
      throw Error();
    }
    expect({
      ...cursoAposAtualizacao,
      inicioCurso: new Date(cursoAposAtualizacao.inicioCurso),
      fimCurso: new Date(cursoAposAtualizacao.fimCurso),
      atualizadoEm: undefined,
    }).toStrictEqual({
      ...cursoAtualizado,
      atualizadoEm: undefined,
    });

    const horarioRegistradaAtualizadao = new Date(
      cursoAposAtualizacao.atualizadoEm
    );
    expect(horarioRegistradaAtualizadao.getTime()).toBeGreaterThanOrEqual(
      horarioAntesAtualizacao.getTime()
    );
  }
});
