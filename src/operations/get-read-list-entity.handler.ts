import { Request, RequestHandler, Response } from 'express';
import { DataAdapterStorage } from '../utils/create-data-adapter-storage';
import { ReadListOperationConfig } from '../typing-utils/operations';

export const getReadListEntityHandler = (methodConfigs: ReadListOperationConfig, dataAdapterStorage: DataAdapterStorage): RequestHandler => {
  const dataAdapter = dataAdapterStorage.getAdapter(methodConfigs.dataJsonPath!);

  return (req: Request, res: Response) => {
    const requestedItem = dataAdapter.getAll((item: any) => (
        Object.entries(req.params).every(([param, value]) => (item[methodConfigs.paramMatch![param]] === value)) &&
        Object.entries(req.body).every(([param, value]) => (item[methodConfigs.filterMatch![param]] === value)) &&
        Object.entries(req.query).every(([param, value]) => (item[methodConfigs.filterMatch![param]] === value))
    ));

    res.send(requestedItem);
  }
};
