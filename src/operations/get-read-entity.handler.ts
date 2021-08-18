import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import { ReadOperationConfig } from '../types';
import { DataAdapterStorage } from '../utils/create-data-adapter-storage';

export const getReadEntityHandler = (methodConfigs: ReadOperationConfig, dataAdapterStorage: DataAdapterStorage): RequestHandler => {
  const dataAdapter = dataAdapterStorage.getAdapter(methodConfigs.dataJsonPath!);

  return (req: Request, res: Response) => {
    if (!methodConfigs.readOne) {
      res.send(dataAdapter.getAll());
      return;
    }

    const requestedItem = dataAdapter.getOne((item) => {
      return (
        Object.entries(req.params).every(([param, value]) => (item[methodConfigs.paramMatch![param]] === value)) &&
        Object.entries(req.body).every(([param, value]) => (item[methodConfigs.paramMatch![param]] === value))
      )
    });

    res.send(requestedItem);
  }
};
