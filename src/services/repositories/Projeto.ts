import _ from 'lodash';
import { Projeto } from 'tcc-models';
import { DatabaseService } from '../../config/database';
import Database from '../data/Database';
import { CursoClass } from './Curso';
import { MateriaClass } from './Materia';
import { Model, ModelReadFactory } from './Model';

const collection = 'Projeto';

export class ProjetoClass implements Model<Projeto> {
  readonly value: Projeto;

  constructor(projeto: Projeto) {
    this.value = projeto;
  }

  saveFactory(): ModelReadFactory[] {
    let list: ModelReadFactory[] = [];

    if (this.value.aprovado) {
      const projeto: any = _.cloneDeep(this.value);
      delete projeto.cursos;

      list = [...list, { collection: collection, data: projeto }];
    } else {
      list = [...list, { collection: collection, data: this.value }];
    }

    if (this.value.aprovado) {
      this.value.cursos.forEach((curso) => {
        list = [...list, ...new CursoClass(curso).saveFactory()];
      });
    }

    return list;
  }

  readFactory(id: string): DatabaseService<Projeto> {
    const service: DatabaseService<Projeto> = async (db, session) => {
      const leitura = await Database.readData<Projeto & { cursos: [] }>(
        collection,
        'id',
        id,
        db,
        session
      );
      if (!leitura.success) {
        throw leitura.error;
      }

      let projeto: Projeto = {
        ...leitura.data,
      };
      if (projeto.aprovado) {
        const cursosService = new CursoClass({} as any).search(
          'idProjeto',
          this.value.id
        );
        const cursos = await cursosService(db, session);

        projeto.cursos = cursos;
      }

      return projeto;
    };
    return service;
  }

  search(keyField: keyof Projeto, field: any): DatabaseService<Projeto[]> {
    const service: DatabaseService<Projeto[]> = async (db, session) => {
      const leitura = await Database.readDatas<Projeto>(
        collection,
        keyField,
        field,
        db,
        session
      );
      if (!leitura.success) {
        throw leitura.error;
      }
      return leitura.data;
    };
    return service;
  }
}
