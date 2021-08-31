import {
  CreateOperationConfig, DeleteOperationConfig,
  OperationConfig,
  PartialUpdateOperationConfig,
  ReadListOperationConfig,
  ReadOneOperationConfig,
  UpdateOperationConfig,
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

export const isUpdateOperation = (config: OperationConfig): config is UpdateOperationConfig  => (
  config.operation === 'update'
);

export const isPartialUpdateOperation = (config: OperationConfig): config is PartialUpdateOperationConfig  => (
  config.operation === 'partial-update'
);

export const isDeleteOperation = (config: OperationConfig): config is DeleteOperationConfig  => (
  config.operation === 'delete'
);
