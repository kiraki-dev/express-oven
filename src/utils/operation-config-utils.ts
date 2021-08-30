import {
  CreateOperationConfig, OperationConfig, ReadListOperationConfig, ReadOneOperationConfig,
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

export const isUpdateOperation = (config: OperationConfig): config is CreateOperationConfig  => (
  config.operation === 'update'
);

export const isPartialUpdateOperation = (config: OperationConfig): config is CreateOperationConfig  => (
  config.operation === 'partial-update'
);

export const isDeleteOperation = (config: OperationConfig): config is CreateOperationConfig  => (
  config.operation === 'delete'
);
