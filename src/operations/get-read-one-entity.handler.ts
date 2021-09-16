import { Request, RequestHandler, Response } from 'express';
import { DataAdapterStorage } from '../utils/create-data-adapter-storage';
import { ReadOneOperationConfig } from '../typing-utils/operations';
import { matchEntitiesByParams } from '../utils/entity-utils';
import { delay } from '../utils/misc';
import { createResponseBuilder } from '../utils/create-response-model';

export const getReadOneEntityHandler = (
  methodConfigs: ReadOneOperationConfig,
  dataAdapterStorage: DataAdapterStorage
): RequestHandler => {
  const dataAdapter = dataAdapterStorage.getAdapter(methodConfigs.dataJsonPath!);

  return async (req: Request, res: Response) => {
    const responseBuilder = createResponseBuilder(methodConfigs.responseModel);
    const paramsFilter = matchEntitiesByParams(req.params, methodConfigs.paramMatch!);

    const requestedItem = dataAdapter.getAll(paramsFilter);

    await delay(methodConfigs.delay)

    responseBuilder.setData(requestedItem);
    responseBuilder.write(res);
  };
};
