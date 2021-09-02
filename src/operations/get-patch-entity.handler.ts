import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import { DataAdapterStorage } from '../utils/create-data-adapter-storage';
import { UpdateOperationConfig } from '../typing-utils/operations';

export const getUpdateEntityHandler = (methodConfigs: UpdateOperationConfig, dataAdapterStorage: DataAdapterStorage): RequestHandler => {
  const dataAdapter = dataAdapterStorage.getAdapter(methodConfigs.dataJsonPath!);

  return (req: Request, res: Response) => {
    const patchedItem = dataAdapter.patchOne((item: any) => {
      return Object.entries(req.params).every(([param, value]) => (
        item[methodConfigs.paramMatch[param]] === String(value)
      ))
    }, req.body, methodConfigs.save);

    methodConfigs.returnEntity ? res.send(patchedItem) : res.end();
  }
};