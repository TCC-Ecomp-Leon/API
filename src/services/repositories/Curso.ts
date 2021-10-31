import _ from 'lodash';
import { Curso } from 'tcc-models';
import { DatabaseService } from '../../config/database';
import Database from '../data/Database';
import { MateriaClass } from './Materia';
import { Model, ModelReadFactory } from './Model';

const collection = 'Curso';

export class CursoClass implements Model<Curso> {
  readonly value: Curso;

  constructor(curso: Curso) {
    this.value = curso;
  }

  saveFactory(): ModelReadFactory[] {
    let list: ModelReadFactory[] = [];

    const curso: any = _.cloneDeep(this.value);
    delete curso.materias;

    list = [...list, { collection: collection, data: curso }];

    this.value.materias.forEach((materia) => {
      list = [...list, ...new MateriaClass(materia).saveFactory()];
    });

    return list;
  }

  readFactory(id: string): DatabaseService<Curso> {
    const service: DatabaseService<Curso> = async (db, session) => {
      const leitura = await Database.readData<Omit<Curso, 'materias'>>(
        collection,
        'id',
        id,
        db,
        session
      );
      if (!leitura.success) {
        throw leitura.error;
      }

      const materiasService = new MateriaClass({} as any).search(
        'idCurso',
        this.value.id
      );

      const materias = await materiasService(db, session);
      return {
        ...leitura.data,
        materias: materias,
      };
    };
    return service;
  }

  search(keyField: keyof Curso, field: any): DatabaseService<Curso[]> {
    const service: DatabaseService<Curso[]> = async (db, session) => {
      const leitura = await Database.readDatas<Curso>(
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
