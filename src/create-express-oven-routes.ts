import { IRouter, Router } from 'express';

import { ApiConfig, PartialApiConfig } from './typing-utils/api-config';
import { DefaultConfigs } from './typing-utils/default-config';

import { createRouterForApiMethod } from './create-router-for-api-method';
import { readConfigs } from './utils/read-configs';
import { createDataAdapterStorage } from './utils/create-data-adapter-storage';
import { fixConfigs } from './utils/fix-configs';
import validateConfigs from './validations/validate-configs';
import { universalBodyParser } from './express-oven-route-configs';

export interface ExpressOvenConfig {
  apis: ApiConfig;
  defaultConfigs: DefaultConfigs;
}

export interface PartialExpressOvenConfig {
  apis?: PartialApiConfig;
  defaultConfigs: Partial<DefaultConfigs>;
}

export interface CreateExpressOvenRoutesOptions {
  configs?: PartialExpressOvenConfig;
  configsPath?: string;
}

export const createExpressOvenRoutes = (options?: CreateExpressOvenRoutesOptions): IRouter => {
  const router = Router();

  router.use(universalBodyParser);

  const dataAdapterStorage = createDataAdapterStorage();

  const configs = fixConfigs(readConfigs(options));

  validateConfigs(configs);

  Object.entries(configs.apis).map(([url, methodConfigs]) => {
    router.use(createRouterForApiMethod(url, methodConfigs, dataAdapterStorage));
  });

  return router;
};
