import { HttpMethod } from './typing-utils/api-config';
import { Router } from 'express';
import { isHttpMethod } from './constants';
import { getCreateEntityHandler } from './operations/get-create-entity.handler';
import { DataAdapterStorage } from './utils/create-data-adapter-storage';
import { getUpdateEntityHandler } from './operations/get-update-entity.handler';
import { OperationConfig } from './typing-utils/operations';
import { getAppUrl } from './utils/url-utils';
import { getReadListEntityHandler } from './operations/get-read-list-entity.handler';
import { getReadOneEntityHandler } from './operations/get-read-one-entity.handler';
import { getDeleteEntityHandler } from './operations/get-delete-entity.handler';
import {
  isCreateOperation,
  isDeleteOperation,
  isPatchOperation,
  isReadListOperation,
  isReadOneOperation,
  isUpdateOperation,
} from './utils/operation-config-utils';

export const createRouterForApiMethod = (
  url: string,
  apiMethodConfig: Partial<Record<HttpMethod, OperationConfig>>,
  dataAdapterStorage: DataAdapterStorage,
) => {
  const router = Router();

  Object.entries(apiMethodConfig).map(([method, methodConfig]) => {
    if (!isHttpMethod(method) ?? !methodConfig) {
      throw new Error(`Unknown method ${method} ${url}`);
    }

    router[method as HttpMethod](url, getOperationHandler(methodConfig, dataAdapterStorage));

    console.info('[INFO]',
      `hit ${method.toUpperCase()} ${getAppUrl(url)} for ${methodConfig.operation.toUpperCase()} operation`);
  });

  return router;
};

const getOperationHandler = (operationConfig: OperationConfig, dataAdapterStorage: DataAdapterStorage) => {
  if (isCreateOperation(operationConfig)) {
    return getCreateEntityHandler(operationConfig, dataAdapterStorage);
  } else if (isReadOneOperation(operationConfig)) {
    return getReadOneEntityHandler(operationConfig, dataAdapterStorage);
  } else if (isReadListOperation(operationConfig)) {
    return getReadListEntityHandler(operationConfig, dataAdapterStorage);
  } else if (isUpdateOperation(operationConfig)) {
    return getUpdateEntityHandler(operationConfig, dataAdapterStorage);
  } else if (isDeleteOperation(operationConfig)) {
    return getDeleteEntityHandler(operationConfig, dataAdapterStorage);
  } else if (isPatchOperation(operationConfig)) {
    throw new Error('Under Construction!');
  }

  const shouldNotHappen: never = operationConfig;
  throw new Error(`The operation "${(shouldNotHappen as any)?.operation}" is not handled!`);
};
