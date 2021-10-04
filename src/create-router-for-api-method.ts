import { Router } from 'express';
import multer from 'multer';
import { HttpMethod } from './typing-utils/api-config';
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
  isCreateOperationWithFile,
  isDeleteOperation,
  isPatchOperation,
  isReadListOperation,
  isReadOneOperation,
  isUpdateOperation,
} from './utils/operation-config-utils';
import { getPatchEntityHandler } from './operations/get-patch-entity.handler';
import { getCreateEntityWithFileHandler } from './operations/get-create-entity-with-file.handler';

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

    if(isCreateOperationWithFile(methodConfig)) {
      const upload = multer({ dest: methodConfig.handleFile.outputDirectoryPath })
      router[method as HttpMethod](url, upload.array(methodConfig.handleFile.sourceField), getCreateEntityWithFileHandler(methodConfig, dataAdapterStorage));
    } else {
      router[method as HttpMethod](url, getOperationHandler(methodConfig, dataAdapterStorage));
    }

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
    return getPatchEntityHandler(operationConfig, dataAdapterStorage)
  }

  const shouldNotHappen: never = operationConfig;
  throw new Error(`The operation "${(shouldNotHappen as any)?.operation}" is not handled!`);
};
