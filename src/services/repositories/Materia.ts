import _ from 'lodash';
import { Materia } from 'tcc-models';
import { DatabaseService } from '../../config/database';
import Database from '../data/Database';
import { Model, ModelReadFactory } from './Model';

const collection = 'Materia';

export class MateriaClass implements Model<Materia> {
  readonly value: Materia;

  constructor(materia: Materia) {
    this.value = materia;
  }

  saveFactory(): ModelReadFactory[] {
    return [{ collection: collection, data: this.value }];
  }

  readFactory(id: string): DatabaseService<Materia> {
    const service: DatabaseService<Materia> = async (db, session) => {
      const leitura = await Database.readData<Materia>(
        collection,
        'id',
        id,
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

  search(keyField: keyof Materia, field: any): DatabaseService<Materia[]> {
    const service: DatabaseService<Materia[]> = async (db, session) => {
      const leitura = await Database.readDatas<Materia>(
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
