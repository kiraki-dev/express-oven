import { IRouter, Router } from 'express';
import { ApiConfig, DefaultConfigs, RecursivePartial } from './types';
import { createRouterForApiMethod } from './create-router-for-api-method';
import { readConfigs } from './utils/read-configs';
import { createDataAdapterStorage } from './utils/create-data-adapter-storage';
import { validateConfigs } from './utils/validation';
import { fixConfigs } from './utils/fix-configs';

export interface ExpressOvenConfig {
  apis: ApiConfig;
  defaultConfigs: DefaultConfigs;
}

export interface CreateExpressOvenRoutesOptions {
  configs?: RecursivePartial<ExpressOvenConfig>;
  configsPath?: string;
}

export const createExpressOvenRoutes = (options?: CreateExpressOvenRoutesOptions): IRouter => {
  const router = Router();
  const dataAdapterStorage = createDataAdapterStorage();

  const configs = fixConfigs(readConfigs(options));

  validateConfigs(configs)

  Object.entries(configs.apis).map(([url, methodConfigs]) => {
    router.use(createRouterForApiMethod(url, methodConfigs, dataAdapterStorage));
  });

  return router;
};
