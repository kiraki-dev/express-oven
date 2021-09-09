import { HttpMethod } from './typing-utils/api-config';
import { DefaultConfigs } from './typing-utils/default-config';

export const DEFAULT_CONFIG_PATH = 'oven.configs.json5';

export const HTTP_METHODS = ['get', 'post', 'put', 'patch', 'delete'];
export const isHttpMethod = (method: string): method is HttpMethod => HTTP_METHODS.includes(method);

export const DEFAULT_CONFIGS: DefaultConfigs = {
  save: false,
  returnEntity: true,
  delay: 300,
  responseModel: {
    paths: { },
  },
};
