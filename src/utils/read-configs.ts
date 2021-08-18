import { resolve } from 'path';
import { DEFAULT_CONFIG_PATH } from '../constants';
import { readFileSync } from 'fs';
import { parse } from 'json5';
import { CreateExpressOvenRoutesOptions, PartialExpressOvenConfig } from '../create-express-oven-routes';

export const readConfigs = (options?: CreateExpressOvenRoutesOptions): PartialExpressOvenConfig => {
  if (options?.configs) {
    return options.configs;
  }

  const filePath = resolve(process.cwd(), options?.configsPath ?? DEFAULT_CONFIG_PATH);

  try {
    const configFile = readFileSync(filePath, { encoding: 'utf-8' });

    return parse(configFile);
  } catch (err) {
    console.error(err);
    throw new Error(`Config file "${filePath}" isn't available.`);
  }
};
