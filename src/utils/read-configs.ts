import { resolve } from 'path';
import { DEFAULT_CONFIG_PATH, DEFAULT_CONFIGS } from '../constants';
import { readFileSync } from 'fs';
import { parse } from 'json5';
import { CreateExpressOvenRoutesOptions, ExpressOvenConfig } from '../create-express-oven-routes';

export const readConfigs = (options?: CreateExpressOvenRoutesOptions): ExpressOvenConfig => {
  if (options?.configs) {
    return {
      ...options.configs,
      defaultConfigs: options.configs.defaultConfigs || DEFAULT_CONFIGS,
    };
  }

  const filePath = resolve(__dirname, options?.configsPath ?? DEFAULT_CONFIG_PATH);

  try {
    const configFile = readFileSync(filePath, { encoding: 'utf-8' });
    const configs = parse(configFile);

    return {
      ...configs,
      defaultConfigs: configs.defaultConfigs || DEFAULT_CONFIGS,
    };
  } catch (err) {
    console.error(err);
    throw new Error(`Config file "${filePath}" isn't available.`);
  }
};
