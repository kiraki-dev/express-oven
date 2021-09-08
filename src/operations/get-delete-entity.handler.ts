import { DeleteOperationConfig } from '../typing-utils/operations';
import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import { DataAdapterStorage } from '../utils/create-data-adapter-storage';
import { matchEntitiesByParams } from '../utils/entity-utils';
import { delay } from '../utils/misc';

export const getDeleteEntityHandler = (methodConfigs: DeleteOperationConfig, dataAdapterStorage: DataAdapterStorage): RequestHandler => {
  const dataAdapter = dataAdapterStorage.getAdapter(methodConfigs.dataJsonPath!);

  return async (req: Request, res: Response) => {
    const deletedItem = dataAdapter.deleteOne(matchEntitiesByParams(req.params, methodConfigs.paramMatch), methodConfigs.save);

    await delay(methodConfigs.delay)
    methodConfigs.returnEntity ? res.send(deletedItem) : res.end();
  }
};
