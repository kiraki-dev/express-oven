export type Operation = 'create' | 'read' | 'update' | 'partial-update' | 'delete';
export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export type IdType = string | number;

// todo: separate CreateOperationConfig and others

export interface OperationConfig {
  operation?: Operation;
  readOne?: boolean;
  uidField?: {
    name: string,
    type: string,
  },
  paramMatch?: {
    [param: string]: string;
  }
  save?: boolean;
  dataJsonPath?: string;
}

export type ApiConfig = Record<string, Partial<Record<HttpMethod, OperationConfig>>>;

export interface DefaultConfigs {
  save?: boolean;
}
