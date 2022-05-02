import { IdType } from './misc';

export interface DocRef<T> {
  readonly id: IdType;
  delete: () => Promise<T>;
  update: (data: Partial<T>) => Promise<void>;
  get: () => Promise<T>;
  set: (data: T) => Promise<void>;
}

export interface DataAdapter<T> {
  query: () => Promise<DocRef<T>[]>;
  ref: (id?: IdType) => DocRef<T>;
}
