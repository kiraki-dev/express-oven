import { WithOptional } from './typings';

export interface CreateOperationConfig {
  operation: 'create';
  uidField: {
    name: string,
    type: string,
  },
  save: boolean;
  dataJsonPath: string;
  returnEntity: boolean;
}

export interface ReadOneOperationConfig {
  operation: 'read';
  readOne: true;
  paramMatch: {
    [param: string]: string;
  }
  dataJsonPath: string;
}

export interface ReadListOperationConfig {
  operation: 'read';
  readOne: false;
  dataJsonPath: string;
}

export interface UpdateOperationConfig {
  operation: 'update';
  paramMatch: {
    [param: string]: string;
  }
  dataJsonPath: string;
  save: boolean;
  returnEntity: boolean;
}

export interface PartialUpdateOperationConfig {
  operation: 'partial-update';
  paramMatch: {
    [param: string]: string;
  }
  dataJsonPath: string;
  returnEntity: boolean;
  save: boolean;
}

export interface DeleteOperationConfig {
  operation: 'delete';
  paramMatch: {
    [param: string]: string;
  }
  dataJsonPath: string;
  returnEntity: boolean;
  save: boolean;
}

export type OperationConfig = (
  CreateOperationConfig |
  ReadOneOperationConfig |
  ReadListOperationConfig |
  UpdateOperationConfig |
  PartialUpdateOperationConfig |
  DeleteOperationConfig
);

export type Operation = OperationConfig['operation'];

export type PartialOperationConfig = (
  WithOptional<CreateOperationConfig, 'operation' | 'returnEntity' | 'save'> |
  WithOptional<ReadOneOperationConfig, 'operation' | 'readOne'> |
  WithOptional<ReadListOperationConfig, 'operation' | 'readOne'> |
  WithOptional<UpdateOperationConfig, 'operation' | 'returnEntity' | 'save'> |
  WithOptional<PartialUpdateOperationConfig, 'operation' | 'returnEntity' | 'save'> |
  WithOptional<DeleteOperationConfig, 'operation' | 'returnEntity' | 'save'>
);
