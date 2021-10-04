import { CreateOperationConfig } from '../typing-utils/operations';
import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import { DataAdapterStorage } from '../utils/create-data-adapter-storage';
import { delay, getNumberId } from '../utils/misc';
import { genUid } from 'light-uid';
import { createResponseBuilder } from '../utils/create-response-model';

export const getCreateEntityHandler = (
  methodConfigs: CreateOperationConfig,
  dataAdapterStorage: DataAdapterStorage
): RequestHandler => {
  const dataAdapter = dataAdapterStorage.getAdapter(methodConfigs.dataJsonPath!);
  const { type, name } = methodConfigs.uidField;

  return async (req: Request, res: Response) => {
    const responseBuilder = createResponseBuilder(methodConfigs.responseModel);

    const newDataItem = {
      [name]: type === 'number' ? getNumberId(dataAdapter.getAll(), name) : genUid(),
      ...req.body,
      ...methodConfigs.extensions.withDefaultValues,
    };

    dataAdapter.addOne(newDataItem, methodConfigs.save!);

    await delay(methodConfigs.delay);

    responseBuilder.setData(methodConfigs.returnEntity ? newDataItem : { [name]: newDataItem[name] });
    responseBuilder.write(res);
  };
};
