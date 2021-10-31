import { MateriaClass } from './Materia';
import { CursoClass } from './Curso';
import { ProjetoClass } from './Projeto';
import { Projeto, Curso, Materia } from 'tcc-models';
import { v4 as uuid } from 'uuid';
import _ from 'lodash';
import { ModelReadFactory } from './Model';

test('Criação correta dos dados para armazenar a matéria', () => {
  const materia: Materia = {
    id: uuid(),
    idPerfilProfessor: undefined,
    nome: 'Curso Test',
    descricao: 'Teste',
    idCurso: uuid(),
  };

  const factory = new MateriaClass(materia).saveFactory();
  expect(factory).toStrictEqual([
    {
      collection: 'Materia',
      data: materia,
    },
  ]);
});

test('Criação correta dos dados para armazenar um curso', () => {
  const cursoVazio: Curso = {
    id: uuid(),
    nome: 'Curso Test',
    descricao: 'Teste',
    inicioCurso: new Date(),
    fimCurso: new Date(),
    atualizadoEm: new Date(),
    turma: [],
    materias: [],
    idProjeto: uuid(),
  };

  const factoryCursoVazio = new CursoClass(cursoVazio).saveFactory();
  const dataCursoVazio: any = _.cloneDeep(cursoVazio);
  delete dataCursoVazio.materias;

  expect(factoryCursoVazio).toStrictEqual([
    { collection: 'Curso', data: dataCursoVazio },
  ]);

  const idCurso: string = uuid();

  const materia: Materia = {
    id: uuid(),
    idPerfilProfessor: undefined,
    nome: 'Curso Test',
    descricao: 'Teste',
    idCurso: idCurso,
  };

  const cursoComMaterias: Curso = {
    id: uuid(),
    nome: 'Curso Test',
    descricao: 'Teste',
    inicioCurso: new Date(),
    fimCurso: new Date(),
    atualizadoEm: new Date(),
    turma: [uuid(), uuid()],
    materias: [materia, materia],
    idProjeto: uuid(),
  };

  const factoryCursoComMaterias = new CursoClass(
    cursoComMaterias
  ).saveFactory();
  const dataCursoComMaterias: any = _.cloneDeep(cursoComMaterias);
  delete dataCursoComMaterias.materias;

  expect(factoryCursoComMaterias).toStrictEqual([
    { collection: 'Curso', data: dataCursoComMaterias },
    { collection: 'Materia', data: materia },
    { collection: 'Materia', data: materia },
  ]);
});

test('Criação correta dos dados para armazenar um projeto', () => {
  const projetoNaoAprovado: Projeto = {
    id: uuid(),
    nome: 'Projeto Test',
    descricao: 'Teste',
    email: 'projeto@test.com',
    telefone: 12999999999,
    requisicaoEntradaEm: new Date(),
    endereco: {
      rua: 'Rua Teste',
      numero: 0,
      bairro: 'Bairro Teste',
      cidade: 'Cidade Teste',
      estado: 'SP',
      cep: 12332000,
      localizacao: {
        lat: 0,
        lng: 0,
      },
    },
    aprovado: false,
  };
  expect(new ProjetoClass(projetoNaoAprovado).saveFactory()).toStrictEqual([
    { collection: 'Projeto', data: projetoNaoAprovado },
  ]);

  const projetoAprovadoVazio: Projeto = {
    id: uuid(),
    nome: 'Projeto Test',
    descricao: 'Teste',
    email: 'projeto@test.com',
    telefone: 12999999999,
    requisicaoEntradaEm: new Date(),
    endereco: {
      rua: 'Rua Teste',
      numero: 0,
      bairro: 'Bairro Teste',
      cidade: 'Cidade Teste',
      estado: 'SP',
      cep: 12332000,
      localizacao: {
        lat: 0,
        lng: 0,
      },
    },
    aprovado: true,
    idPerfilResponsavel: uuid(),
    entradaEm: new Date(),
    cursos: [],
  };
  const dataProjetoAprovadoVazio: any = _.cloneDeep(projetoAprovadoVazio);
  delete dataProjetoAprovadoVazio.cursos;
  expect(new ProjetoClass(projetoAprovadoVazio).saveFactory()).toStrictEqual([
    { collection: 'Projeto', data: dataProjetoAprovadoVazio },
  ]);

  const idProjeto = uuid();
  const idCurso: string = uuid();

  const materia: Materia = {
    id: uuid(),
    idPerfilProfessor: undefined,
    nome: 'Curso Test',
    descricao: 'Teste',
    idCurso: idCurso,
  };

  const curso: Curso = {
    id: uuid(),
    nome: 'Curso Test',
    descricao: 'Teste',
    inicioCurso: new Date(),
    fimCurso: new Date(),
    atualizadoEm: new Date(),
    turma: [uuid(), uuid()],
    materias: [materia, materia],
    idProjeto: idProjeto,
  };

  const projetoAprovadoNaoVazio: Projeto = {
    id: idProjeto,
    nome: 'Projeto Test',
    descricao: 'Teste',
    email: 'projeto@test.com',
    telefone: 12999999999,
    requisicaoEntradaEm: new Date(),
    endereco: {
      rua: 'Rua Teste',
      numero: 0,
      bairro: 'Bairro Teste',
      cidade: 'Cidade Teste',
      estado: 'SP',
      cep: 12332000,
      localizacao: {
        lat: 0,
        lng: 0,
      },
    },
    aprovado: true,
    idPerfilResponsavel: uuid(),
    entradaEm: new Date(),
    cursos: [curso, curso],
  };
  const factoryProjetoNaoVazio = new ProjetoClass(
    projetoAprovadoNaoVazio
  ).saveFactory();

  const dadoProjetoNaoVazio: any = _.cloneDeep(projetoAprovadoNaoVazio);
  delete dadoProjetoNaoVazio.cursos;
  const expectedFactoryProjetoNaoVazio: ModelReadFactory[] = [
    { collection: 'Projeto', data: dadoProjetoNaoVazio },
  ];
  projetoAprovadoNaoVazio.cursos.forEach((curso) => {
    const dadoCurso: any = _.cloneDeep(curso);
    delete dadoCurso.materias;

    expectedFactoryProjetoNaoVazio.push({
      collection: 'Curso',
      data: dadoCurso,
    });

    curso.materias.forEach((materia) => {
      expectedFactoryProjetoNaoVazio.push({
        collection: 'Materia',
        data: materia,
      });
    });
  });

  expect(factoryProjetoNaoVazio).toStrictEqual(expectedFactoryProjetoNaoVazio);
});
