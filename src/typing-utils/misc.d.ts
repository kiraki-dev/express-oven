export interface ResponseModel {
  paths: {
    data?: string;
  };
}
export type IdType = string | number;
export type IdFieldType = 'string' | 'number';

export type KeyWithIdValue<T, K extends keyof T = keyof T> = T[K] extends IdType ? K : never;
