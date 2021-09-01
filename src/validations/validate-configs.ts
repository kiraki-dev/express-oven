import { ExpressOvenConfig } from '../create-express-oven-routes';
import { ajv } from './ajv-config';
import { isHttpMethod } from '../constants';
import {
  isCreateOperation, isDeleteOperation, isPatchOperation,
  isReadListOperation,
  isReadOneOperation,
  isUpdateOperation,
} from '../utils/operation-config-utils';

const validateConfigs = (configs: ExpressOvenConfig) => {
  ajv.validate('express-oven-config.schema.json', configs);

  Object.entries(configs.apis).forEach(([, config]) => {
    Object.entries(config).forEach(([method, operationConfig]) => {
      if (!isHttpMethod(method) || !operationConfig) {
        throw new Error(`Unknown method '${method}'`);
      }

      if (isCreateOperation(operationConfig)) {
        ajv.validate('create-entity-operation-config.schema.json', operationConfig);
      } else if (isReadOneOperation(operationConfig)) {
        ajv.validate('read-one-entity-operation-config.schema.json', operationConfig);
      } else if (isReadListOperation(operationConfig)) {
        ajv.validate('read-entity-list-operation-config.schema.json', operationConfig);
      } else if (isUpdateOperation(operationConfig)) {
        ajv.validate('update-entity-operation-config.schema.json', operationConfig);
      } else if (isPatchOperation(operationConfig)) {
        ajv.validate('patch-entity-operation-config.schema.json', operationConfig);
      } else if (isDeleteOperation(operationConfig)) {
        ajv.validate('delete-entity-operation-config.schema.json', operationConfig);
      }
    });
  });

  console.log(ajv.errors);

  return !!ajv.errors;
};

export default validateConfigs;
