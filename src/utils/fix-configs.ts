import { ExpressOvenConfig, PartialExpressOvenConfig } from '../create-express-oven-routes';
import { DEFAULT_CONFIGS, isHttpMethod } from '../constants';
import { HttpMethod } from '../typing-utils/api-config';
import {
  CreateOperationConfig, Operation, PartialCreateOperationConfig, PartialDeleteOperationConfig, PartialOperationConfig,
  PartialPatchOperationConfig,
  PartialReadListOperationConfig,
  PartialReadOneOperationConfig, PartialUpdateOperationConfig, PatchOperationConfig,
} from '../typing-utils/operations';
import { DefaultConfigs } from '../typing-utils/default-config';

export const fixConfigs = (configs: PartialExpressOvenConfig): ExpressOvenConfig => {
  const fixedConfigs = {
    ...configs,
    defaultConfigs: { ...DEFAULT_CONFIGS, ...configs.defaultConfigs },
  } as ExpressOvenConfig;

  if (!configs.apis) {
    return fixedConfigs;
  }

  Object.entries(configs.apis).forEach(([, config]) => {
    if (!config) {
      return;
    }

    Object.entries(config).forEach(([method, operationConfig]) => {
      if (!isHttpMethod(method) || !operationConfig) {
        return;
      }

      if (!operationConfig.operation) {
        operationConfig.operation = methodToOperationMap[method];
      }

      if (operationConfig.operation === 'create') {
        fixCreateOperation(operationConfig, fixedConfigs.defaultConfigs)
      } else if (operationConfig.operation === 'read') {
        fixReadOperation(operationConfig, fixedConfigs.defaultConfigs)
      } else if (operationConfig.operation === 'update') {
        fixUpdateOperation(operationConfig, fixedConfigs.defaultConfigs)
      } else if (operationConfig.operation === 'patch') {
        fixPatchOperation(operationConfig, fixedConfigs.defaultConfigs)
      } else if (operationConfig.operation === 'delete') {
        fixDeleteOperation(operationConfig, fixedConfigs.defaultConfigs)
      }
      fixOtherConfigs(operationConfig, fixedConfigs.defaultConfigs)
    });
  });

  return fixedConfigs;
};

const methodToOperationMap: Record<HttpMethod, Operation> = {
  get: 'read',
  post: 'create',
  put: 'update',
  delete: 'delete',
  patch: 'patch',
};

const fixCreateOperation = (config: PartialCreateOperationConfig, defaultConfigs: DefaultConfigs) => {
  config.save = config.save || defaultConfigs.save;
  config.returnEntity = config.returnEntity || defaultConfigs.returnEntity;
}

const fixReadOperation = (config: PartialReadOneOperationConfig | PartialReadListOperationConfig, defaultConfigs: DefaultConfigs) => {
  config.readOne = config.readOne || false;
}

const fixUpdateOperation = (config: PartialUpdateOperationConfig, defaultConfigs: DefaultConfigs) => {
  config.save = config.save || defaultConfigs.save;
  config.returnEntity = config.returnEntity || defaultConfigs.returnEntity;
}

const fixPatchOperation = (config: PartialPatchOperationConfig, defaultConfigs: DefaultConfigs) => {
  config.save = config.save || defaultConfigs.save;
  config.returnEntity = config.returnEntity || defaultConfigs.returnEntity;
}

const fixDeleteOperation = (config: PartialDeleteOperationConfig, defaultConfigs: DefaultConfigs) => {
  config.save = config.save || defaultConfigs.save;
  config.returnEntity = config.returnEntity || defaultConfigs.returnEntity;
}

const fixOtherConfigs = (config: PartialOperationConfig, defaultConfigs: DefaultConfigs) => {
  config.delay = config.delay || defaultConfigs.delay;
}
