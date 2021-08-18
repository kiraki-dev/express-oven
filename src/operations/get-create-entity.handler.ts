import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import genUid from 'light-uid';
import { CreateOperationConfig } from '../types';
import { DataAdapterStorage } from '../utils/create-data-adapter-storage';
import { getNumberId } from '../utils/get-number-id';

export const getCreateEntityHandler = (methodConfigs: CreateOperationConfig, dataAdapterStorage: DataAdapterStorage): RequestHandler => {
  const dataAdapter = dataAdapterStorage.getAdapter(methodConfigs.dataJsonPath!);

  return (req: Request, res: Response) => {
    const { uidField } = methodConfigs;

    const newDataItem = {
      [uidField!.name]: uidField!.type === 'number' ? getNumberId(dataAdapter.getAll(), uidField!.name) : genUid(),
      ...req.body,
    };

    dataAdapter.addOne(newDataItem, methodConfigs.save!);

    res.send(newDataItem);
  }
};
