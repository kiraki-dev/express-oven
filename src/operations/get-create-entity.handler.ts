import { CreateOperationConfig, OperationConfig } from '../types';
import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import { DataAdapterStorage } from '../utils/create-data-adapter-storage';
import { getNumberId } from '../utils/get-number-id';
import genUid from 'light-uid';

export const getCreateEntityHandler = (methodConfigs: CreateOperationConfig, dataAdapterStorage: DataAdapterStorage): RequestHandler => {
  if (!isValidCreateOperationConfig(methodConfigs)) {
    throw new Error('uidField property is required for create type operations');
  }

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

const isValidCreateOperationConfig = (config: OperationConfig): config is CreateOperationConfig => {
  return config.hasOwnProperty('uidField');
}
