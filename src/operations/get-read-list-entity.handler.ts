import { Request, RequestHandler, Response } from 'express';
import { DataAdapterStorage } from '../utils/create-data-adapter-storage';
import { ReadListOperationConfig } from '../typing-utils/operations';
import { matchEntitiesByBodyFilters, matchEntitiesByParams, matchEntitiesByQueryFilters } from '../utils/entity-utils';
import { delay } from '../utils/misc';
import { createResponseBuilder } from '../utils/create-response-model';

export const getReadListEntityHandler = (
  methodConfigs: ReadListOperationConfig,
  dataAdapterStorage: DataAdapterStorage,
): RequestHandler => {
  const dataAdapter = dataAdapterStorage.getAdapter(methodConfigs.dataJsonPath!);

  return async (req: Request, res: Response) => {
    const responseBuilder = createResponseBuilder(methodConfigs.responseModel);
    const paramsFilter = matchEntitiesByParams(req.params, methodConfigs.paramMatch);
    const queryFilter = matchEntitiesByQueryFilters(req.query, methodConfigs.queryMatch);
    const bodyFilter = matchEntitiesByBodyFilters(req.body, methodConfigs.bodyMatch);

    const requestedItems = dataAdapter.getAll((item) => (
      paramsFilter(item) && queryFilter(item) && bodyFilter(item)
    ));

    const finalItems = requestedItems.map((item) => ({
      ...item,
      ...methodConfigs.extensions.withDefaultValues,
    }));

    await delay(methodConfigs.delay);

    responseBuilder.setData(finalItems);
    responseBuilder.write(res);
  };
};
