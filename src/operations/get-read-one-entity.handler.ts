import { Request, RequestHandler, Response } from 'express';
import { DataAdapterStorage } from '../utils/create-data-adapter-storage';
import { ReadOneOperationConfig } from '../typing-utils/operations';

export const getReadOneEntityHandler = (methodConfigs: ReadOneOperationConfig, dataAdapterStorage: DataAdapterStorage): RequestHandler => {
  const dataAdapter = dataAdapterStorage.getAdapter(methodConfigs.dataJsonPath!);

  return (req: Request, res: Response) => {
    const requestedItem = dataAdapter.getOne((item: any) => (
        Object.entries(req.params).every(([param, value]) => (item[methodConfigs.paramMatch![param]] === value))
    ));

    res.send(requestedItem);
  }
};
