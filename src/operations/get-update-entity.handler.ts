import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import { UpdateOperationConfig } from '../types';
import { DataAdapterStorage } from '../utils/create-data-adapter-storage';

export const getUpdateEntityHandler = (methodConfigs: UpdateOperationConfig, dataAdapterStorage: DataAdapterStorage): RequestHandler => {
  const dataAdapter = dataAdapterStorage.getAdapter(methodConfigs.dataJsonPath!);

  return (req: Request, res: Response) => {
    const updatedItem = dataAdapter.updateOne((item) => {
      return Object.entries(req.params).every(([param, value]) => (
        item[methodConfigs.paramMatch[param]] === value
      ))
    }, req.body, methodConfigs.save);

    res.send(updatedItem);
  }
};
