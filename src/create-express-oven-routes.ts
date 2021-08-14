import { ApiConfig, DefaultConfigs } from './types';
import { IRouter, Router } from 'express';
import { createRouterForApiMethod } from './create-router-for-api-method';
import { readConfigs } from './utils/read-configs';
import { createDataAdapterStorage } from './utils/create-data-adapter-storage';

export interface ExpressOvenConfig {
  apis: ApiConfig;
  defaultConfigs: DefaultConfigs;
}

export interface CreateExpressOvenRoutesOptions {
  configs?: ExpressOvenConfig;
  configsPath?: string;
}

export const createExpressOvenRoutes = (options?: CreateExpressOvenRoutesOptions): IRouter => {
  const router = Router();
  const dataAdapterStorage = createDataAdapterStorage();

  const configs = readConfigs(options);

  // verifyConfigs()

  // fix configs here
  // configs.defaultConfigs

  Object.entries(configs.apis).map(([url, methodConfigs]) => {
    router.use(createRouterForApiMethod(url, methodConfigs, dataAdapterStorage));
  });

  return router;
};
