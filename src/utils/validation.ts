import { OperationConfig } from '../types';
import { ExpressOvenConfig } from '../create-express-oven-routes';

type Error = Record<string, Record<string, object>>;

export const validateConfigs = (configs: ExpressOvenConfig) => {
  const errors = {} as Error;

  Object.entries(configs.apis).forEach(([url, config]) => {
    Object.entries(config).forEach(([method, operationConfig]) => {
      if (operationConfig.operation === 'create') {
        validateCreateOperationConfig(url, method, operationConfig, errors);
      } else if (operationConfig.operation === 'read') {
        validateReadOperationConfig(url, method, operationConfig, errors);
      }
    });
  });

  const errorsArray = Object.entries(errors);

  if (errorsArray.length) {
    // throw errors
  }
};

const validateCreateOperationConfig = (
  url: string,
  method: string,
  config: OperationConfig,
  errors: Error,
): void => {
  let createErrors = {};
  const hasUidField = config.hasOwnProperty('uidField');
  const hasSave = config.hasOwnProperty('save');

  if (!hasUidField) {
    createErrors = {
      ...createErrors,
      uidField: 'Create operation requires for config to have "uidField" field!',
    };
  }

  if (!hasSave) {
    createErrors = {
      ...createErrors,
      save: 'Create operation requires for config to have "save" field!',
    };
  }

  if (Object.keys(createErrors).length) {
    errors[url] = errors[url] ? {
      ...errors[url],
      create: {
        [method]: createErrors,
      },
    } : {
      create: {
        [method]: createErrors,
      }
    };
  }
};

const validateReadOperationConfig = (
  url: string,
  method: string,
  config: OperationConfig,
  errors: Error,
): void => {
  let readErrors = {};
  const hasReadOne = config.hasOwnProperty('readOne');

  if (!hasReadOne) {
    readErrors = {
      ...readErrors,
      uidField: 'Read operation requires for config to have "readOne" field!',
    };
  }

  if (Object.keys(readErrors).length) {
    errors[url] = errors[url] ? {
      ...errors[url],
      read: {
        [method]: readErrors,
      },
    } : {
      read: {
        [method]: readErrors,
      }
    };
  }
};
