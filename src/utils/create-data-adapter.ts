import { readFileSync, writeFileSync } from 'fs';
import { resolveProjectPath } from './path-utils';

export interface DataAdapter<T> {
  getAll(predicate?: (item: T) => boolean): T[];

  addOne(item: T, save: boolean): void;

  updateOne(predicate: (item: T) => boolean, item: T, save: boolean): T | null;

  getOne(predicate: (item: T) => boolean): T | null;

  deleteOne(predicate: (item: T) => boolean, save: boolean): T | null;
}

export const createDataAdapter = <T>(jsonPath: string): DataAdapter<T> => {
  const finalPath = resolveProjectPath(jsonPath);

  const jsonStr = readFileSync(finalPath, { encoding: 'utf-8' });
  let data: T[] = JSON.parse(jsonStr);

  const saveData = () => writeFileSync(finalPath, JSON.stringify(data));

  return {
    getAll(predicate: (item: T) => boolean): T[] {
      return predicate ? data.filter(predicate) : data;
    },
    getOne(predicate: (item: T) => boolean): T | null {
      return data.find(predicate) ?? null;
    },
    addOne(item: T, save: boolean): void {
      data.push(item);

      save && saveData();
    },
    deleteOne(predicate: (item: T) => boolean, save: boolean): T | null {
      const itemToDelete = this.getOne(predicate);
      data = data.filter((item) => item !== itemToDelete);

      save && saveData();

      return itemToDelete;
    },
    updateOne(predicate: (item: T) => boolean, item: T, save: boolean): T {
      data = data.map((current) => predicate(current) ? item : current);
      save && saveData();

      return item;
    },
  };
};
