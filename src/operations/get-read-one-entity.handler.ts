import { Request, RequestHandler, Response } from 'express';
import { DataAdapterStorage } from '../utils/create-data-adapter-storage';
import { ReadOneOperationConfig } from '../typing-utils/operations';
import { matchEntitiesByParams } from '../utils/entity-utils';

export const getReadOneEntityHandler = (methodConfigs: ReadOneOperationConfig, dataAdapterStorage: DataAdapterStorage): RequestHandler => {
  const dataAdapter = dataAdapterStorage.getAdapter(methodConfigs.dataJsonPath!);

  return (req: Request, res: Response) => {
    const paramsFilter = matchEntitiesByParams(req.params, methodConfigs.paramMatch!);

    const requestedItem = dataAdapter.getAll(paramsFilter);
    res.send(requestedItem);
  };
};
