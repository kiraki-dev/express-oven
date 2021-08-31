import { Request, RequestHandler, Response } from 'express';
import { DataAdapterStorage } from '../utils/create-data-adapter-storage';
import { DeleteOperationConfig, ReadOneOperationConfig } from '../typing-utils/operations';

export const getDeleteEntityHandler = (methodConfigs: DeleteOperationConfig, dataAdapterStorage: DataAdapterStorage): RequestHandler => {
  const dataAdapter = dataAdapterStorage.getAdapter(methodConfigs.dataJsonPath!);

  return (req: Request, res: Response) => {
    const deletingItem = dataAdapter.deleteOne((item: any) => (
        Object.entries(req.params).every(([param, value]) => (item[methodConfigs.paramMatch![param]] === value))
    ), methodConfigs.save);

    res.send(methodConfigs.returnEntity ? deletingItem : { deleted: true });
  }
};
