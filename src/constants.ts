import { DefaultConfigs } from './types';

export const DEFAULT_CONFIG_PATH = 'oven.configs.json5';

export const HTTP_METHODS = ['get', 'post', 'put', 'patch', 'delete'];

export const DEFAULT_CONFIGS: DefaultConfigs = {
  save: false,
  readOne: false,
};
