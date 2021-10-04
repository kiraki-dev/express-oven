import { WithOptional } from './typings';
import { ResponseModel } from './misc';

export interface CreateOperationConfig {
  operation: 'create';
  uidField: Record<'name' | 'type', string>;
  paramMatch?: Record<string, string>;
  save: boolean;
  dataJsonPath: string;
  returnEntity: boolean;
  delay: number;
  responseModel: ResponseModel;
  extensions: {
    withDefaultValues: Record<string, any>;
  };
}

export interface CreateOperationWithFileConfig extends CreateOperationConfig {
  handleFile: {
    sourceField: string;
    outputDirectoryPath: string;
    exportedFields?: {
      fileName: string;
      fileSize: string;
    }
    returnAsArray?: boolean;
  };
}

export interface ReadOneOperationConfig {
  operation: 'read';
  readOne: true;
  paramMatch?: Record<string, string>;
  filterMatch?: Record<string, string>;
  bodyMatch?: Record<string, string>;
  queryMatch?: Record<string, string>;
  dataJsonPath: string;
  delay: number;
  responseModel: ResponseModel;
  extensions: {
    withDefaultValues: Record<string, any>;
  };
}

export interface ReadListOperationConfig {
  operation: 'read';
  readOne: false;
  paramMatch?: Record<string, string>;
  filterMatch?: Record<string, string>;
  bodyMatch?: Record<string, string>;
  queryMatch?: Record<string, string>;
  dataJsonPath: string;
  delay: number;
  responseModel: ResponseModel;
  extensions: {
    withDefaultValues: Record<string, any>;
  };
}

export interface UpdateOperationConfig {
  operation: 'update';
  paramMatch: Record<string, string>;
  dataJsonPath: string;
  save: boolean;
  returnEntity: boolean;
  delay: number;
  responseModel: ResponseModel;
  extensions: {
    withDefaultValues: Record<string, any>;
  };
}

export interface PatchOperationConfig {
  operation: 'patch';
  paramMatch: Record<string, string>;
  dataJsonPath: string;
  returnEntity: boolean;
  save: boolean;
  delay: number;
  responseModel: ResponseModel;
  extensions: {
    withDefaultValues: Record<string, any>;
  };
}

export interface DeleteOperationConfig {
  operation: 'delete';
  paramMatch: Record<string, string>;
  dataJsonPath: string;
  returnEntity: boolean;
  save: boolean;
  delay: number;
  responseModel: ResponseModel;
}

export type OperationConfig = (
  CreateOperationConfig |
  ReadOneOperationConfig |
  ReadListOperationConfig |
  UpdateOperationConfig |
  PatchOperationConfig |
  DeleteOperationConfig |
  CreateOperationWithFileConfig
);

export type Operation = OperationConfig['operation'];

export type PartialCreateOperationConfig = WithOptional<CreateOperationConfig, 'operation' | 'returnEntity' | 'save' | 'delay' | 'responseModel' | 'extensions'>;
export type PartialCreateOperationConfigWithFile = WithOptional<CreateOperationWithFileConfig, 'operation' | 'returnEntity' | 'save' | 'delay' | 'responseModel'>;
export type PartialReadOneOperationConfig = WithOptional<ReadOneOperationConfig, 'operation' | 'readOne' | 'delay' | 'responseModel' | 'extensions'>;
export type PartialReadListOperationConfig = WithOptional<ReadListOperationConfig, 'operation' | 'readOne' | 'delay' | 'responseModel' | 'extensions'>;
export type PartialUpdateOperationConfig = WithOptional<UpdateOperationConfig, 'operation' | 'returnEntity' | 'save' | 'delay' | 'responseModel' | 'extensions'>;
export type PartialPatchOperationConfig = WithOptional<PatchOperationConfig, 'operation' | 'returnEntity' | 'save' | 'delay' | 'responseModel' | 'extensions'>;
export type PartialDeleteOperationConfig = WithOptional<DeleteOperationConfig, 'operation' | 'returnEntity' | 'save' | 'delay' | 'responseModel'>;

export type PartialOperationConfig = (
  PartialCreateOperationConfig |
  PartialReadOneOperationConfig |
  PartialReadListOperationConfig |
  PartialUpdateOperationConfig |
  PartialPatchOperationConfig |
  PartialDeleteOperationConfig |
  PartialCreateOperationConfigWithFile
);
