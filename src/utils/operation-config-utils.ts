import {
  OperationConfig,
  CreateOperationConfig,
  ReadListOperationConfig,
  ReadOneOperationConfig,
  UpdateOperationConfig,
  PatchOperationConfig,
  DeleteOperationConfig,
  CreateOperationWithFileConfig,
} from '../typing-utils/operations';

export const isReadOneOperation = (config: OperationConfig): config is ReadOneOperationConfig  => (
  config.operation === 'read' && config.readOne
);

export const isReadListOperation = (config: OperationConfig): config is ReadListOperationConfig  => (
  config.operation === 'read' && !config.readOne
);

export const isCreateOperation = (config: OperationConfig): config is CreateOperationConfig  => (
  config.operation === 'create'
);

export const isCreateOperationWithFile = (config: OperationConfig): config is CreateOperationWithFileConfig  => (
  isCreateOperation(config) && !!(config as CreateOperationWithFileConfig).handleFile
);

export const isUpdateOperation = (config: OperationConfig): config is UpdateOperationConfig  => (
  config.operation === 'update'
);

export const isPatchOperation = (config: OperationConfig): config is PatchOperationConfig  => (
  config.operation === 'patch'
);

export const isDeleteOperation = (config: OperationConfig): config is DeleteOperationConfig  => (
  config.operation === 'delete'
);
