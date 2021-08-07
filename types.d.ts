export type OperatorTypes = 'create' | 'read' | 'update' | 'delete';
export type MethodTypes = 'get' | 'post' | 'put' | 'delete';

export type ApiMethodConfig = {[day in MethodTypes]: {
  operation: OperatorTypes;
  readOne?: boolean;
  uidField?: {
    "name": string,
    "type": string,
  },
  paramMatch?: {
    [key: string]: string;
  }
  save?: boolean;
  dataPath?: string;
}};

export interface ApiConfig {
  [key: string]: ApiMethodConfig
}

export interface DefaultConfigs {
  save?: boolean;
  readOne?: boolean;
}


export interface GenerateOvenExpressConfigs {
  defaultConfigs: DefaultConfigs;
  apis: { dataPath?: string; } & ApiConfig
}
