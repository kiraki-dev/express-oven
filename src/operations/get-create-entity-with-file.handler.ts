import { CreateOperationWithFileConfig } from '../typing-utils/operations';
import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import { DataAdapterStorage } from '../utils/create-data-adapter-storage';
import { delay, getNumberId } from '../utils/misc';
import { genUid } from 'light-uid';
import { createResponseBuilder } from '../utils/create-response-model';
import { setPropDeep } from '../utils/object-utils';

export const getCreateEntityWithFileHandler = (
  methodConfigs: CreateOperationWithFileConfig,
  dataAdapterStorage: DataAdapterStorage,
): RequestHandler => {
  const dataAdapter = dataAdapterStorage.getAdapter(methodConfigs.dataJsonPath!);
  const { type: uidType, name: uidName } = methodConfigs.uidField;

  return async (req: Request, res: Response) => {
    const responseBuilder = createResponseBuilder(methodConfigs.responseModel);

    const newDataItems = [] as any[];
    (req.files as Express.Multer.File[]).forEach((file: Express.Multer.File) => {
      let newDataItem = {
        [uidName]: uidType === 'number' ? getNumberId(dataAdapter.getAll(), uidName) : genUid(),
        ...req.body,
        ...methodConfigs.extensions.withDefaultValues,
      };

      methodConfigs.handleFile.exportedFields?.fileName && setPropDeep(newDataItem, methodConfigs.handleFile.exportedFields.fileName, file.originalname);
      methodConfigs.handleFile.exportedFields?.fileSize && setPropDeep(newDataItem, methodConfigs.handleFile.exportedFields.fileSize, file.size);

      newDataItems.push(newDataItem);
      dataAdapter.addOne(newDataItem, methodConfigs.save!);
    });
    const returnData = methodConfigs.returnEntity
      ? newDataItems
      : newDataItems.map((dataItem) => ({ [uidName]: dataItem[uidName] }));

    await delay(methodConfigs.delay);

    responseBuilder.setData(
      methodConfigs.handleFile.returnAsArray || returnData.length !== 1 ? returnData : returnData[0]
    );
    responseBuilder.write(res);
  };
};
