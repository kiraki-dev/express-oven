import { Request, RequestHandler, Response } from 'express';
import { DataAdapterStorage } from '../utils/create-data-adapter-storage';
import { ReadListOperationConfig } from '../typing-utils/operations';
import { matchEntitiesByBodyFilters, matchEntitiesByParams, matchEntitiesByQueryFilters } from '../utils/entity-utils';
import { delay } from '../utils/misc';

export const getReadListEntityHandler = (methodConfigs: ReadListOperationConfig, dataAdapterStorage: DataAdapterStorage): RequestHandler => {
  const dataAdapter = dataAdapterStorage.getAdapter(methodConfigs.dataJsonPath!);

  return async (req: Request, res: Response) => {
    const paramsFilter = matchEntitiesByParams(req.params, methodConfigs.paramMatch);
    const queryFilter = matchEntitiesByQueryFilters(req.query, methodConfigs.filterMatch);
    const bodyFilter = matchEntitiesByBodyFilters(req.query, methodConfigs.filterMatch);

    const requestedItems = dataAdapter.getAll((item: any) => (
      paramsFilter(item) && queryFilter(item) && bodyFilter(item)
    ));

    await delay(methodConfigs.delay)
    res.send(requestedItems);
  };
};
