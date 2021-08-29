import { ExpressOvenConfig, PartialExpressOvenConfig } from '../create-express-oven-routes';
import { DEFAULT_CONFIGS, isHttpMethod } from '../constants';
import { HttpMethod } from '../typing-utils/api-config';
import { Operation } from '../typing-utils/operations';

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
        // have separate fixers for each one of them. Because they can get bigger.
        operationConfig.save = operationConfig.save || fixedConfigs.defaultConfigs.save;
        operationConfig.returnEntity = operationConfig.returnEntity || fixedConfigs.defaultConfigs.returnEntity;
      } else if (operationConfig.operation === 'read') {
        if (!operationConfig.hasOwnProperty('readOne')) {
          operationConfig.readOne = false;
        }
      }
    });
  });

  return fixedConfigs;
};

const methodToOperationMap: Record<HttpMethod, Operation> = {
  get: 'read',
  post: 'create',
  put: 'update',
  delete: 'delete',
  patch: 'partial-update',
};
