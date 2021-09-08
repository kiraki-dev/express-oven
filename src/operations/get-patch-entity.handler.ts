import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import { DataAdapterStorage } from '../utils/create-data-adapter-storage';
import { PatchOperationConfig, UpdateOperationConfig } from '../typing-utils/operations';
import { matchEntitiesByParams } from '../utils/entity-utils';

export const getPatchEntityHandler = (methodConfigs: PatchOperationConfig, dataAdapterStorage: DataAdapterStorage): RequestHandler => {
  const dataAdapter = dataAdapterStorage.getAdapter(methodConfigs.dataJsonPath!);

  return (req: Request, res: Response) => {
    const paramsFilter = matchEntitiesByParams(req.params, methodConfigs.paramMatch);

    const patchedItem = dataAdapter.patchOne(paramsFilter, req.body, methodConfigs.save);

    methodConfigs.returnEntity ? res.send(patchedItem) : res.end();
  }
};
