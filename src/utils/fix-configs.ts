import merge from 'deepmerge';
import { ExpressOvenConfig, PartialExpressOvenConfig } from '../create-express-oven-routes';
import { DEFAULT_CONFIGS, isHttpMethod } from '../constants';
import { HttpMethod } from '../typing-utils/api-config';
import {
  Operation,
  PartialCreateOperationConfig,
  PartialCreateOperationConfigWithFile,
  PartialDeleteOperationConfig,
  PartialOperationConfig,
  PartialPatchOperationConfig,
  PartialReadListOperationConfig,
  PartialReadOneOperationConfig,
  PartialUpdateOperationConfig,
} from '../typing-utils/operations';
import { DefaultConfigs } from '../typing-utils/default-config';

export const fixConfigs = (configs: PartialExpressOvenConfig): ExpressOvenConfig => {
  const fixedConfigs = {
    ...configs,
    defaultConfigs: merge(DEFAULT_CONFIGS, configs.defaultConfigs),
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
        if ((operationConfig as PartialCreateOperationConfigWithFile).handleFile) {
          fixCreateOperationWithFile(operationConfig as PartialCreateOperationConfigWithFile, fixedConfigs.defaultConfigs);
        }
        fixCreateOperation(operationConfig, fixedConfigs.defaultConfigs);
      } else if (operationConfig.operation === 'read') {
        fixReadOperation(operationConfig, fixedConfigs.defaultConfigs);
      } else if (operationConfig.operation === 'update') {
        fixUpdateOperation(operationConfig, fixedConfigs.defaultConfigs);
      } else if (operationConfig.operation === 'patch') {
        fixPatchOperation(operationConfig, fixedConfigs.defaultConfigs);
      } else if (operationConfig.operation === 'delete') {
        fixDeleteOperation(operationConfig, fixedConfigs.defaultConfigs);
      }
      fixCommonConfigs(operationConfig, fixedConfigs.defaultConfigs);
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
  config.extensions = config.extensions || { withDefaultValues: {} };
};

const fixReadOperation = (config: PartialReadOneOperationConfig | PartialReadListOperationConfig,
  defaultConfigs: DefaultConfigs) => {
  config.readOne = config.readOne || false;
  config.extensions = config.extensions || { withDefaultValues: {} };
};

const fixUpdateOperation = (config: PartialUpdateOperationConfig, defaultConfigs: DefaultConfigs) => {
  config.save = config.save || defaultConfigs.save;
  config.returnEntity = config.returnEntity || defaultConfigs.returnEntity;
  config.extensions = config.extensions || { withDefaultValues: {} };
};

const fixPatchOperation = (config: PartialPatchOperationConfig, defaultConfigs: DefaultConfigs) => {
  config.save = config.save || defaultConfigs.save;
  config.returnEntity = config.returnEntity || defaultConfigs.returnEntity;
  config.extensions = config.extensions || { withDefaultValues: {} };
};

const fixDeleteOperation = (config: PartialDeleteOperationConfig, defaultConfigs: DefaultConfigs) => {
  config.save = config.save || defaultConfigs.save;
  config.returnEntity = config.returnEntity || defaultConfigs.returnEntity;
};

const fixCreateOperationWithFile = (config: PartialCreateOperationConfigWithFile, defaultConfigs: DefaultConfigs) => {
  config.handleFile = {
    ...config.handleFile,
    outputDirectoryPath: config.handleFile.outputDirectoryPath || defaultConfigs.handleFile.directoryPath,
  };
};

const fixCommonConfigs = (config: PartialOperationConfig, defaultConfigs: DefaultConfigs) => {
  config.delay = config.delay || defaultConfigs.delay;
  config.responseModel = merge(defaultConfigs.responseModel, config.responseModel || {});
};
