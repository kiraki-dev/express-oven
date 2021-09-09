import { DeleteOperationConfig } from '../typing-utils/operations';
import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import { DataAdapterStorage } from '../utils/create-data-adapter-storage';
import { matchEntitiesByParams } from '../utils/entity-utils';
import { delay } from '../utils/misc';
import { createResponseBuilder } from '../utils/create-response-model';

export const getDeleteEntityHandler = (
  methodConfigs: DeleteOperationConfig,
  dataAdapterStorage: DataAdapterStorage
): RequestHandler => {
  const dataAdapter = dataAdapterStorage.getAdapter(methodConfigs.dataJsonPath!);

  return async (req: Request, res: Response) => {
    const responseBuilder = createResponseBuilder(methodConfigs.responseModel);
    const deletedItem = dataAdapter.deleteOne(matchEntitiesByParams(req.params, methodConfigs.paramMatch), methodConfigs.save);

    await delay(methodConfigs.delay);
    if (methodConfigs.returnEntity) {
      responseBuilder.setData(deletedItem);
    }

    responseBuilder.write(res);
  };
};
