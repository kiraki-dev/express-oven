import { IdType } from './misc';
import { AndQuery, OrQuery } from '../queries/query';

export interface DocRef<T> {
  readonly id: IdType;
  delete: () => Promise<T>;
  update: (data: Partial<T>) => Promise<void>;
  get: () => Promise<T>;
  set: (data: T) => Promise<void>;
}

export interface DataAdapter<T> {
  query: (query?: AndQuery | OrQuery | undefined) => Promise<DocRef<T>[]>;
  ref: (id?: IdType) => DocRef<T>;
}
