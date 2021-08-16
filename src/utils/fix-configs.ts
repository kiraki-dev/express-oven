import { ExpressOvenConfig } from '../create-express-oven-routes';

export const fixConfigs = (configs: ExpressOvenConfig): ExpressOvenConfig => {
  const fixedConfigs = { ...configs } as ExpressOvenConfig;
  Object.entries(configs.apis).forEach(([url, config]) => {
    Object.entries(config).forEach(([method, operationConfig]) => {
      if (operationConfig.operation === 'create') {
          operationConfig.save = operationConfig.save || configs.defaultConfigs.save;
      } else if (operationConfig.operation === 'read') {
        operationConfig.readOne = operationConfig.readOne || configs.defaultConfigs.readOne;
      }
    })
  })

  return fixedConfigs;
}
