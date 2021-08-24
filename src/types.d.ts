export type Operation = 'create' | 'read' | 'update' | 'partial-update' | 'delete';
export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export type IdType = string | number;

export type RecursivePartial<T> = {
  [K in keyof T]?: T[K] extends Record<any, any> ? RecursivePartial<T[K]> : T[K];
}

export interface CreateOperationConfig {
  operation: 'create';
  uidField: {
    name: string,
    type: string,
  },
  save: boolean;
  dataJsonPath?: string;
}

export interface ReadOperationConfig {
  operation: 'read';
  readOne: boolean;
  paramMatch?: {
    [param: string]: string;
  }
  dataJsonPath?: string;
}

export type OperationConfig = CreateOperationConfig | ReadOperationConfig;

export type ApiConfig = Record<string, Partial<Record<HttpMethod, OperationConfig>>>;

export interface DefaultConfigs {
  save: boolean;
  readOne: boolean;
}
