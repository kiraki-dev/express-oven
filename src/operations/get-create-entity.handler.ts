import { writeFile } from 'fs';
import { OperationConfig } from '../types';
import { Application, Request, Response, Router } from 'express';
import { IRouterMatcher, RequestHandler } from 'express-serve-static-core';
import { DataAdapterStorage } from '../utils/create-data-adapter-storage';
import { getNumberId } from '../utils/get-number-id';
import genUid from 'light-uid';

export const getCreateEntityHandler = (methodConfigs: OperationConfig, dataAdapterStorage: DataAdapterStorage): RequestHandler => {
  // isValidCreateOperationConfig
  if (!methodConfigs.uidField) {
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
