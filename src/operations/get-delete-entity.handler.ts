import { DeleteOperationConfig } from '../typing-utils/operations';
import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import { DataAdapterStorage } from '../utils/create-data-adapter-storage';
import { matchEntitiesByParams } from '../utils/entity-utils';

export const getDeleteEntityHandler = (methodConfigs: DeleteOperationConfig, dataAdapterStorage: DataAdapterStorage): RequestHandler => {
  const dataAdapter = dataAdapterStorage.getAdapter(methodConfigs.dataJsonPath!);

  return (req: Request, res: Response) => {
    const deletedItem = dataAdapter.deleteOne(matchEntitiesByParams(req.params, methodConfigs.paramMatch), methodConfigs.save);

    if (methodConfigs.returnEntity) {
      res.send(deletedItem);
    } else {
      res.end();
    }
  };
};
