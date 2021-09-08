import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import { DataAdapterStorage } from '../utils/create-data-adapter-storage';
import { delay } from '../utils/misc';
import { PatchOperationConfig } from '../typing-utils/operations';
import { matchEntitiesByParams } from '../utils/entity-utils';

export const getPatchEntityHandler = (methodConfigs: PatchOperationConfig, dataAdapterStorage: DataAdapterStorage): RequestHandler => {
  const dataAdapter = dataAdapterStorage.getAdapter(methodConfigs.dataJsonPath!);

  return async (req: Request, res: Response) => {
    const paramsFilter = matchEntitiesByParams(req.params, methodConfigs.paramMatch);

    const patchedItem = dataAdapter.patchOne(paramsFilter, req.body, methodConfigs.save);

    await delay(methodConfigs.delay)
    methodConfigs.returnEntity ? res.send(patchedItem) : res.end();
  }
};
