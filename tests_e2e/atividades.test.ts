import { addDays, subDays } from 'date-fns';
import request from 'supertest';
import app from '../src/app';
import {
  DatabaseService,
  withDatabaseTransaction,
} from '../src/config/database';
import {
  Atividade,
  AvaliacaoRespostaBancoDeQuestoes,
  BancoDeQuestoes,
  CodigoDeEntrada,
  Perfil,
  RegraPerfil,
  RespostaAlternativa,
  RespostaAtividade,
  RespostaDissertativa,
  StatusRespostaDissertativa,
  TipoAtividade,
  TipoCodigoDeEntrada,
} from '../src/models';
import { InformacoesAtividade } from '../src/schemas/atividade';
import {
  InformacoesCorrecaoQuestoesDissertativas,
  InformacoesRespostaAlternativa,
  InformacoesRespostaBancoDeQuestoes,
  InformacoesRespostaDissertativa,
} from '../src/schemas/respostaAtividade';
import Database from '../src/services/data/Database';

jest.setTimeout(100000);

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
const respostaEndpoint = '/resposta-atividade';
const bancoDeQuestoesEndpoint = '/banco-questoes';

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

let atividadeAlternativaRegistrada: Atividade & {
  tipoAtividade: TipoAtividade.Alternativa;
};
let atividadeDissertativaRegistrada: Atividade & {
  tipoAtividade: TipoAtividade.Dissertativa;
};
let atividadeBancoRegistrada: Atividade & {
  tipoAtividade: TipoAtividade.BancoDeQuestoes;
};

let respostaAtividadeAlternativa: RespostaAtividade & {
  tipo: TipoAtividade.Alternativa;
};
let respostaAtividadeDissertativa: RespostaAtividade & {
  tipo: TipoAtividade.Dissertativa;
};
let respostaAtividadeBancoDeQuestoes: RespostaAtividade & {
  tipo: TipoAtividade.BancoDeQuestoes;
};

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
  atividadeAlternativaRegistrada = atividadeRegistrada;

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
  atividadeDissertativaRegistrada = atividadeRegistrada;

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
  atividadeBancoRegistrada = atividadeRegistrada;

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

test('Responder uma atividade alternativa', async () => {
  const informacoes: InformacoesRespostaAlternativa = {
    tipo: TipoAtividade.Alternativa,
    respostas: atividadeAlternativaRegistrada.itens.map(
      (questao): RespostaAlternativa => {
        return {
          idQuestao: questao.idQuestao,
          alternativas: questao.alternativas,
        };
      }
    ),
  };

  const result = await request(app)
    .post(respostaEndpoint + '/' + atividadeAlternativaRegistrada.id)
    .set(`Authorization`, `Bearer ${alunoAuthToken}`)
    .send(informacoes);

  expect(result.statusCode).toStrictEqual(200);
  const idResposta = result.body['idResposta'] as string;

  const obterResposta = await request(app)
    .get(respostaEndpoint + '/' + idResposta)
    .set(`Authorization`, `Bearer ${alunoAuthToken}`);
  expect(obterResposta.statusCode).toStrictEqual(200);

  const resposta = obterResposta.body['resposta'] as RespostaAtividade;
  if (resposta.tipo !== TipoAtividade.Alternativa) throw Error('');

  expect(resposta.encerrada).toStrictEqual(false);
  respostaAtividadeAlternativa = resposta;
});

test('Responder uma atividade dissertativa', async () => {
  const informacoes: InformacoesRespostaDissertativa = {
    tipo: TipoAtividade.Dissertativa,
    respostas: atividadeDissertativaRegistrada.itens.map(
      (questao): RespostaDissertativa => {
        return {
          idQuestao: questao.idQuestao,
          resposta: {
            foto: false,
            texto: 'teste',
          },
        };
      }
    ),
  };

  const result = await request(app)
    .post(respostaEndpoint + '/' + atividadeDissertativaRegistrada.id)
    .set(`Authorization`, `Bearer ${alunoAuthToken}`)
    .send(informacoes);

  expect(result.statusCode).toStrictEqual(200);
  const idResposta = result.body['idResposta'] as string;

  const obterResposta = await request(app)
    .get(respostaEndpoint + '/' + idResposta)
    .set(`Authorization`, `Bearer ${alunoAuthToken}`);
  expect(obterResposta.statusCode).toStrictEqual(200);

  const resposta = obterResposta.body['resposta'] as RespostaAtividade;
  if (resposta.tipo !== TipoAtividade.Dissertativa) throw Error('');

  expect(resposta.corrigida).toStrictEqual(false);
  respostaAtividadeDissertativa = resposta;
});

test('Responder uma atividade banco de questões', async () => {
  const informacoes: InformacoesRespostaBancoDeQuestoes = {
    tipo: TipoAtividade.BancoDeQuestoes,
    respostas: [
      {
        enunciado: 'Teste inserção de item no banco de questões',
        alternativas: [
          {
            item: 'a) alternativa a',
            value: false,
          },
          {
            item: 'b) alternativa b',
            value: false,
          },
          {
            item: 'c) alternativa c',
            value: true,
          },
          {
            item: 'd) alternativa d',
            value: false,
          },
        ],
      },
    ],
  };

  const result = await request(app)
    .post(respostaEndpoint + '/' + atividadeBancoRegistrada.id)
    .set(`Authorization`, `Bearer ${universitarioAuthToken}`)
    .send(informacoes);

  expect(result.statusCode).toStrictEqual(200);
  const idResposta = result.body['idResposta'] as string;

  const obterResposta = await request(app)
    .get(respostaEndpoint + '/' + idResposta)
    .set(`Authorization`, `Bearer ${universitarioAuthToken}`);
  expect(obterResposta.statusCode).toStrictEqual(200);

  const resposta = obterResposta.body['resposta'] as RespostaAtividade;
  if (resposta.tipo !== TipoAtividade.BancoDeQuestoes) throw Error('');

  expect(resposta.avaliada).toStrictEqual(false);
  respostaAtividadeBancoDeQuestoes = resposta;

  const novoLoginUniversitario = await signIn(
    emailUniversitario,
    senhaUniversitario
  );
  const perfilUniversitarioPosCorrecao = novoLoginUniversitario.perfil;
  universitarioAuthToken = novoLoginUniversitario.authToken;
  if (perfilUniversitarioPosCorrecao.regra !== RegraPerfil.Geral)
    throw Error('');
  if (!perfilUniversitarioPosCorrecao.universitario.universitario)
    throw Error('');
  expect(
    perfilUniversitarioPosCorrecao.universitario.atividadesQueColaborou.length
  ).toStrictEqual(1);
  const colaboracaoRegistrada =
    perfilUniversitarioPosCorrecao.universitario.atividadesQueColaborou.find(
      (colaboracao) =>
        colaboracao.idResposta === respostaAtividadeBancoDeQuestoes.id
    );
  if (colaboracaoRegistrada === undefined) throw Error('');
  expect(colaboracaoRegistrada.aprovado).toStrictEqual(false);
  expect(colaboracaoRegistrada.horas).toStrictEqual(
    atividadeBancoRegistrada.tempoColaboracao
  );
});

test('Simulação de uma atividade alternativa já fechada para visualizar a nota', async () => {
  const service: DatabaseService<void> = async (db, session) => {
    const campoIdAtividade: keyof Atividade = 'id';
    const dbResult = await Database.updatePartialData<
      Atividade & { tipoAtividade: TipoAtividade.Alternativa }
    >(
      'Atividade',
      [{ key: campoIdAtividade, value: atividadeAlternativaRegistrada.id }],
      { fechamentoRespostas: subDays(new Date(), 1) },
      db,
      session
    );
    if (!dbResult.success) {
      throw Error('');
    }
  };
  await withDatabaseTransaction(service);

  const idResposta = respostaAtividadeAlternativa.id;

  const obterResposta = await request(app)
    .get(respostaEndpoint + '/' + idResposta)
    .set(`Authorization`, `Bearer ${alunoAuthToken}`);
  expect(obterResposta.statusCode).toStrictEqual(200);

  const resposta = obterResposta.body['resposta'] as RespostaAtividade;
  if (resposta.tipo !== TipoAtividade.Alternativa) throw Error('');

  expect(resposta.encerrada).toStrictEqual(true);
  if (!resposta.encerrada) throw Error('');
  expect(resposta.nota).toStrictEqual(10);
});

test('Correção resposta dissertaviva', async () => {
  const idResposta = respostaAtividadeDissertativa.id;

  const informacoes: InformacoesCorrecaoQuestoesDissertativas =
    respostaAtividadeDissertativa.respostas.map((resposta) => {
      return {
        idQuestao: resposta.idQuestao,
        nota: 8,
        status: StatusRespostaDissertativa.ParcialmenteCerto,
        comentarios: 'teste',
      };
    });

  const result = await request(app)
    .put(respostaEndpoint + '/' + idResposta)
    .set(`Authorization`, `Bearer ${universitarioAuthToken}`)
    .send(informacoes);

  expect(result.statusCode).toStrictEqual(200);

  const obterResposta = await request(app)
    .get(respostaEndpoint + '/' + idResposta)
    .set(`Authorization`, `Bearer ${alunoAuthToken}`);
  expect(obterResposta.statusCode).toStrictEqual(200);

  const resposta = obterResposta.body['resposta'] as RespostaAtividade;
  if (resposta.tipo !== TipoAtividade.Dissertativa) throw Error('');
  expect(resposta.corrigida).toStrictEqual(true);
  if (!resposta.corrigida) throw Error('');
  expect(resposta.nota).toStrictEqual(8);

  const novoLoginUniversitario = await signIn(
    emailUniversitario,
    senhaUniversitario
  );
  const perfilUniversitarioPosCorrecao = novoLoginUniversitario.perfil;
  universitarioAuthToken = novoLoginUniversitario.authToken;
  if (perfilUniversitarioPosCorrecao.regra !== RegraPerfil.Geral)
    throw Error('');
  if (!perfilUniversitarioPosCorrecao.universitario.universitario)
    throw Error('');
  expect(
    perfilUniversitarioPosCorrecao.universitario.atividadesQueColaborou.length
  ).toStrictEqual(2);
  const colaboracaoRegistrada =
    perfilUniversitarioPosCorrecao.universitario.atividadesQueColaborou.find(
      (colaboracao) =>
        colaboracao.idResposta === respostaAtividadeDissertativa.id
    );
  if (colaboracaoRegistrada === undefined) throw Error('');
  expect(colaboracaoRegistrada.aprovado).toStrictEqual(true);
  expect(colaboracaoRegistrada.horas).toStrictEqual(
    atividadeDissertativaRegistrada.tempoColaboracao
  );
});

test('Aprovação de resposta do banco de questões', async () => {
  const questoesProjetoAntes = await obterListaQuestoesBancoDeQuestoes(
    projetoAuthToken,
    idProjeto,
    undefined,
    undefined,
    undefined
  );

  const idResposta = respostaAtividadeBancoDeQuestoes.id;
  const informacoes: AvaliacaoRespostaBancoDeQuestoes = {
    avaliacaoQuestoes: respostaAtividadeBancoDeQuestoes.respostas.map(
      (resposta) => {
        return {
          idQuestao: resposta.idQuestao,
          aprovada: true,
        };
      }
    ),
    comentario: 'Muito bom, estamos finalizando a API',
  };

  const result = await request(app)
    .put(respostaEndpoint + '/' + idResposta)
    .set(`Authorization`, `Bearer ${projetoAuthToken}`)
    .send(informacoes);

  expect(result.statusCode).toStrictEqual(200);

  const questoesProjetoDepois = await obterListaQuestoesBancoDeQuestoes(
    projetoAuthToken,
    idProjeto,
    undefined,
    undefined,
    undefined
  );

  expect(
    questoesProjetoDepois.length - questoesProjetoAntes.length
  ).toStrictEqual(respostaAtividadeBancoDeQuestoes.respostas.length);
});

const obterListaQuestoesBancoDeQuestoes = async (
  authToken: string,
  idProjeto: string,
  idCurso: string | undefined,
  idMateria: string | undefined,
  assuntos: string[] | undefined
): Promise<BancoDeQuestoes[]> => {
  const responde = await request(app)
    .get(bancoDeQuestoesEndpoint + '/' + idProjeto)
    .set(`Authorization`, `Bearer ${authToken}`)
    .query(idCurso !== undefined ? { curso: idCurso } : {})
    .query(idMateria !== undefined ? { materia: idMateria } : {})
    .query(assuntos !== undefined ? { assuntos: assuntos } : {});

  expect(responde.statusCode).toStrictEqual(200);
  if (responde.statusCode !== 200) {
    throw Error('');
  }

  const questoes = responde.body['questoes'] as BancoDeQuestoes[];
  return questoes;
};

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
