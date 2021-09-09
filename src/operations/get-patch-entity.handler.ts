import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import { DataAdapterStorage } from '../utils/create-data-adapter-storage';
import { delay } from '../utils/misc';
import { PatchOperationConfig } from '../typing-utils/operations';
import { matchEntitiesByParams } from '../utils/entity-utils';
import { createResponseBuilder } from '../utils/create-response-model';

export const getPatchEntityHandler = (
  methodConfigs: PatchOperationConfig,
  dataAdapterStorage: DataAdapterStorage
): RequestHandler => {
  const dataAdapter = dataAdapterStorage.getAdapter(methodConfigs.dataJsonPath!);

  return async (req: Request, res: Response) => {
    const responseBuilder = createResponseBuilder(methodConfigs.responseModel);
    const paramsFilter = matchEntitiesByParams(req.params, methodConfigs.paramMatch);

    const patchedItem = dataAdapter.patchOne(paramsFilter, req.body, methodConfigs.save);

    await delay(methodConfigs.delay);
    if (methodConfigs.returnEntity) {
      responseBuilder.setData(patchedItem);
    }

    responseBuilder.write(res);
  };
};
