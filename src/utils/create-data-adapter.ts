import { readFileSync, writeFileSync } from 'fs';

export interface DataAdapter<T> {
  getAll(): T[];

  addOne(item: T, save: boolean): void;

  updateOne(predicate: (item: T) => boolean, item: T, save: boolean): T | null;

  getOne(predicate: (item: T) => boolean): T | null;

  deleteOne(predicate: (item: T) => boolean, save: boolean): T | null;
}

export const createDataAdapter = <T>(path: string): DataAdapter<T> => {
  let data: T[] = JSON.parse(readFileSync(path, { encoding: 'utf-8' }));

  const saveData = () => writeFileSync(path, JSON.stringify(data));

  return {
    getAll: () => data,
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
