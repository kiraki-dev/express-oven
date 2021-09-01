import { CreateOperationConfig } from '../typing-utils/operations';
import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import { DataAdapterStorage } from '../utils/create-data-adapter-storage';
import { getNumberId } from '../utils/misc';
import { genUid } from 'light-uid';

export const getCreateEntityHandler = (methodConfigs: CreateOperationConfig, dataAdapterStorage: DataAdapterStorage): RequestHandler => {
  const dataAdapter = dataAdapterStorage.getAdapter(methodConfigs.dataJsonPath!);
  const { type, name } = methodConfigs.uidField;

  return (req: Request, res: Response) => {
    const newDataItem = {
      [name]: type === 'number' ? getNumberId(dataAdapter.getAll(), name) : genUid(),
      ...req.body,
    };

    dataAdapter.addOne(newDataItem, methodConfigs.save!);

    res.send(methodConfigs.returnEntity ? newDataItem : { [name]: newDataItem[name] });
  };
};
