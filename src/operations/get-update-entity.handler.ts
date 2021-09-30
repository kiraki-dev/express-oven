import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import { DataAdapterStorage } from '../utils/create-data-adapter-storage';
import { UpdateOperationConfig } from '../typing-utils/operations';
import { matchEntitiesByParams } from '../utils/entity-utils';
import { delay } from '../utils/misc';
import { createResponseBuilder } from '../utils/create-response-model';

export const getUpdateEntityHandler = (
  methodConfigs: UpdateOperationConfig,
  dataAdapterStorage: DataAdapterStorage
): RequestHandler => {
  const dataAdapter = dataAdapterStorage.getAdapter(methodConfigs.dataJsonPath!);

  return async (req: Request, res: Response) => {
    const responseBuilder = createResponseBuilder(methodConfigs.responseModel);
    const paramsFilter = matchEntitiesByParams(req.params, methodConfigs.paramMatch);
    const updatedItem = {
      ...dataAdapter.updateOne(paramsFilter, req.body, methodConfigs.save),
      ...methodConfigs.extensions.withDefaultValues,
    };

    await delay(methodConfigs.delay);
    if (methodConfigs.returnEntity) {
      responseBuilder.setData(updatedItem);
    }

    responseBuilder.write(res);
  };
};
