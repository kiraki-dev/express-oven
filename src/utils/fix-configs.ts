import { ExpressOvenConfig } from '../create-express-oven-routes';
import { DEFAULT_CONFIGS } from '../constants';
import { RecursivePartial } from '../types';

export const fixConfigs = (configs: RecursivePartial<ExpressOvenConfig>): ExpressOvenConfig => {
  const fixedConfigs = {
    ...configs,
    defaultConfigs: configs.defaultConfigs || DEFAULT_CONFIGS,
  } as ExpressOvenConfig;

  if (!fixedConfigs.apis) {
    return fixedConfigs;
  }

  Object.entries(fixedConfigs.apis).forEach(([url, config]) => {
    if (!config) {
      return;
    }

    Object.entries(config).forEach(([method, operationConfig]) => {
      if (operationConfig.operation === 'create') {
        // have separate fixers for each one of them. Because they can get bigger.
        operationConfig.save = operationConfig.save || fixedConfigs.defaultConfigs.save;
      } else if (operationConfig.operation === 'read') {
        operationConfig.readOne = operationConfig.readOne || fixedConfigs.defaultConfigs.readOne;
      }
    });
  });

  return fixedConfigs;
};
