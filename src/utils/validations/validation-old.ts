import { ExpressOvenConfig } from '../../create-express-oven-routes';
import { OperationConfig } from '../../typing-utils/operations';

type Error = Record<string, Record<string, object>>;

//// !!!!! GOOD NEWS: https://json-schema.org/
//// everything we were looking for.
//// - - - - - look here for an implementation https://github.com/ajv-validator/ajv

// todo: separate and create different files for each different thing here so we'll be able to test them separately

// todo: have a folder for Errors and separate file for each kind of error
class ConfigValidationError extends Error {
  // you can also have a ApiValidationError which have `path: string` and extends ConfigValidationError
  constructor(public reason: string, message: string) {
    super(message);
  }
}

// todo: replace Error with ConfigValidity
class ConfigValidity {
  get isValid() {
    return this.errors.length === 0;
  }

  errors: ConfigValidationError[] = [];

  addError(error: ConfigValidationError) {
    this.errors.push(error);
  }
}

// todo: instead of validators we can create different schemas (see /src/schemas/)
export const validateConfigs = (configs: ExpressOvenConfig) => {
  const errors = {} as Error;

  // todo: we definitely need to handle this
  // if (!configs.apis) {
  //   configValidity.addError(new ConfigValidationError('Invalid "api"s'));
  // }

  Object.entries(configs.apis).forEach(([url, config]) => {
    Object.entries(config).forEach(([method, operationConfig]) => {
      if (!operationConfig) {
        // this will be an error but let's do that via schema-json
        return;
      }
      // todo: also we need to check if the method is a valid method

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

  if(hasReadOne && 'readOne' in config && config.readOne) {
    if(!config.hasOwnProperty('paramMatch')) {
      readErrors = {
        ...readErrors,
        paramMatch: 'Read operation requires for config to have "paramMatch" field, if "readOne is true" to have identifier for one item',
      };
    }
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
