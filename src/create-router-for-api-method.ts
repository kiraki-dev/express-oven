import { OperationConfig, HttpMethod } from './types';
import { Router } from 'express';
import { HTTP_METHODS } from './constants';
import { getCreateEntityHandler } from './operations/get-create-entity.handler';
import { DataAdapterStorage } from './utils/create-data-adapter-storage';
import { getReadEntityHandler } from './operations/get-read-entity.handler';

export const createRouterForApiMethod = (
  url: string,
  apiMethodConfig: Partial<Record<HttpMethod, OperationConfig>>,
  dataAdapterStorage: DataAdapterStorage,
) => {
  const router = Router();

  Object.entries(apiMethodConfig).map(([method, methodConfig]) => {
    // verifyMethodConfig()

    if (!HTTP_METHODS.includes(method)) {
      throw new Error(`Unknown method [${url}][${method}]`);
    }

    // todo: we need to guess operation based on method

    router[method as HttpMethod](url, getOperationHandler(methodConfig, dataAdapterStorage));

    // router[method as HttpMethod](url, (req, res) => {
    //   let data = getJsonPathData(url, fileData) as any[];
    //
    //   if (methodConfig.operation === 'create') {
    //   } else if (methodConfig.operation === 'read') {
    //     //// maybe do some filtering
    //     res.send(data);
    //   } else if (methodConfig.operation === 'update') {
    //     if (!methodConfig.uidField) {
    //       throw new Error('uidField property is required for update type operations');
    //     }
    //
    //     const updatingItemIndex = data.findIndex((item) => item[methodConfig.uidField!.name] === req.body[methodConfig.uidField!.name])!;
    //
    //     const updatedItem = {
    //       ...data[updatingItemIndex],
    //       ...req.body,
    //     };
    //     data[updatingItemIndex] = updatedItem;
    //
    //     if (methodConfig.save || (methodConfig.save === undefined && defaultConfigs.save)) {
    //       writeFile(url, JSON.stringify(data), (err) => {
    //         if (err) {
    //           throw err;
    //         }
    //       });
    //     }
    //
    //     res.send(updatedItem);
    //   } else if (methodConfig.operation === 'delete') {
    //     if (!methodConfig.uidField) {
    //       throw new Error('uidField property is required for delete type operations');
    //     }
    //
    //     const deletedItem = data.find((item) => item[methodConfig.uidField!.name] === req.body[methodConfig.uidField!.name])!;
    //     data = data.filter((item) => item[methodConfig.uidField!.name] !== req.body[methodConfig.uidField!.name])!;
    //
    //     if (methodConfig.save || (methodConfig.save === undefined && defaultConfigs.save)) {
    //       writeFile(url, JSON.stringify(data), (err) => {
    //         if (err) {
    //           throw err;
    //         }
    //       });
    //     }
    //
    //     res.send(deletedItem);
    //   } else {
    //     throw new Error('No such operation existing!!!');
    //   }
    // });
  });

  return router;
};

const getOperationHandler = (apiConfig: OperationConfig, dataAdapterStorage: DataAdapterStorage) => {
  switch (apiConfig.operation) {
    case 'create':
      return getCreateEntityHandler(apiConfig, dataAdapterStorage);
    case 'read':
      return getReadEntityHandler(apiConfig, dataAdapterStorage);
    // case 'update':
    // case 'delete':
    // case 'partial-update':
    //   throw new Error('Under Construction!');
    default:
      const shouldNotHappen: never = apiConfig;
      throw new Error(`The operation "${(apiConfig as any)?.operation}" is not handled!`);
  }

};
