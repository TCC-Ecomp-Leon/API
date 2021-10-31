import { DatabaseService } from '../../config/database';

export type ModelReadFactory = { collection: string; data: any };

export interface Model<T> {
  readonly value: T;

  saveFactory: () => ModelReadFactory[];
  readFactory: (id: string) => DatabaseService<T>;
  search: (keyField: keyof T, field: any) => DatabaseService<T[]>;
}
