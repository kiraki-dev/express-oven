import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import { DataAdapterStorage } from '../utils/create-data-adapter-storage';
import { UpdateOperationConfig } from '../typing-utils/operations';
import { matchEntitiesByParams } from '../utils/entity-utils';

export const getUpdateEntityHandler = (methodConfigs: UpdateOperationConfig, dataAdapterStorage: DataAdapterStorage): RequestHandler => {
  const dataAdapter = dataAdapterStorage.getAdapter(methodConfigs.dataJsonPath!);

  return (req: Request, res: Response) => {
    const paramsFilter = matchEntitiesByParams(req.params, methodConfigs.paramMatch);
    const updatedItem = dataAdapter.updateOne(paramsFilter, req.body, methodConfigs.save);

    methodConfigs.returnEntity ? res.send(updatedItem) : res.end();
  }
};
