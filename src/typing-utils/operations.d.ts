import { WithOptional } from './typings';

export interface CreateOperationConfig {
  operation: 'create';
  uidField: Record<'name' | 'type', string>;
  paramMatch?: Record<string, string>;
  save: boolean;
  dataJsonPath: string;
  returnEntity: boolean;
}

export interface ReadOneOperationConfig {
  operation: 'read';
  readOne: true;
  paramMatch: Record<string, string>;
  dataJsonPath: string;
}

export interface ReadListOperationConfig {
  operation: 'read';
  readOne: false;
  paramMatch?: Record<string, string>;
  filterMatch?: Record<string, string>;
  dataJsonPath: string;
}

export interface UpdateOperationConfig {
  operation: 'update';
  paramMatch: Record<string, string>;
  dataJsonPath: string;
  save: boolean;
  returnEntity: boolean;
}

export interface PatchOperationConfig {
  operation: 'patch';
  paramMatch: Record<string, string>;
  dataJsonPath: string;
  returnEntity: boolean;
  save: boolean;
}

export interface DeleteOperationConfig {
  operation: 'delete';
  paramMatch: Record<string, string>;
  dataJsonPath: string;
  returnEntity: boolean;
  save: boolean;
}

export type OperationConfig = (
  CreateOperationConfig |
  ReadOneOperationConfig |
  ReadListOperationConfig |
  UpdateOperationConfig |
  PatchOperationConfig |
  DeleteOperationConfig
);

export type Operation = OperationConfig['operation'];

export type PartialCreateOperationConfig = WithOptional<CreateOperationConfig, 'operation' | 'returnEntity' | 'save'>;
export type PartialReadOneOperationConfig = WithOptional<ReadOneOperationConfig, 'operation' | 'readOne'>;
export type PartialReadListOperationConfig = WithOptional<ReadListOperationConfig, 'operation' | 'readOne'>;
export type PartialUpdateOperationConfig = WithOptional<UpdateOperationConfig, 'operation' | 'returnEntity' | 'save'>;
export type PartialPatchOperationConfig = WithOptional<PatchOperationConfig, 'operation' | 'returnEntity' | 'save'>;
export type PartialDeleteOperationConfig = WithOptional<DeleteOperationConfig, 'operation' | 'returnEntity' | 'save'>;

export type PartialOperationConfig = (
  PartialCreateOperationConfig |
  PartialReadOneOperationConfig |
  PartialReadListOperationConfig |
  PartialUpdateOperationConfig |
  PartialPatchOperationConfig |
  PartialDeleteOperationConfig
);
