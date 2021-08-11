import { IRouter, Router } from 'express';
import { writeFile } from 'fs';
import { ApiMethodConfig, DefaultConfigs, GenerateOvenExpressConfigs, MethodTypes } from './types';

const METHODS = ['get', 'post', 'put', 'delete'];

const getPathRouter = (
  url: string,
  apiMethodConfig: ApiMethodConfig,
  defaultConfigs: DefaultConfigs,
  fileData: Map<string, any>,
) => {
  const router = Router();

  Object.entries(apiMethodConfig).map(([method, methodConfigs]) => {
    if (!METHODS.includes(method)) {
      throw new Error('Unknown method');
    }

    router[method as MethodTypes](url, (req, res) => {
      let data = getJsonPathData(url, fileData) as any[];
      if (methodConfigs.operation === 'create') {
        if (!methodConfigs.uidField) {
          throw new Error('uidField property is required for create type operations');
        }

        const newDataItem = {
          [methodConfigs.uidField.name]: methodConfigs.uidField.type === 'number' ? 0 : '', //// change this to get random uid
          ...req.body,
        };
        const newData = [newDataItem, ...data];

        fileData.set(url, newData);

        if (methodConfigs.save || (methodConfigs.save === undefined && defaultConfigs.save)) {
          writeFile(url, JSON.stringify(newData), (err) => {
            if (err) {
              throw err;
            }
          });
        }
        res.send(newDataItem);
      }

      else if (methodConfigs.operation === 'read') {
        //// maybe do some filtering
        res.send(data);
      }

      else if (methodConfigs.operation === 'update') {
        if (!methodConfigs.uidField) {
          throw new Error('uidField property is required for update type operations');
        }

        const updatingItemIndex = data.findIndex((item) => item[methodConfigs.uidField!.name] === req.body[methodConfigs.uidField!.name])!;

        const updatedItem = {
          ...data[updatingItemIndex],
          ...req.body,
        }
        data[updatingItemIndex] = updatedItem;

        if (methodConfigs.save || (methodConfigs.save === undefined && defaultConfigs.save)) {
          writeFile(url, JSON.stringify(data), (err) => {
            if (err) {
              throw err;
            }
          });
        }

        res.send(updatedItem);
      }

      else if (methodConfigs.operation === 'delete') {
        if (!methodConfigs.uidField) {
          throw new Error('uidField property is required for delete type operations');
        }

        const deletedItem = data.find((item) => item[methodConfigs.uidField!.name] === req.body[methodConfigs.uidField!.name])!;
        data = data.filter((item) => item[methodConfigs.uidField!.name] !== req.body[methodConfigs.uidField!.name])!;

        if (methodConfigs.save || (methodConfigs.save === undefined && defaultConfigs.save)) {
          writeFile(url, JSON.stringify(data), (err) => {
            if (err) {
              throw err;
            }
          });
        }

        res.send(deletedItem);
      }

      else {
        throw new Error('No such operation existing!!!');
      }
    });
  });

  return router;
};

const getJsonPathData = (url: string, fileData: Map<string, any>) => {
  if (!fileData.has(url)) {
    const data = require(url);
    fileData.set(url, data);
  }

  return fileData.get(url);
};

export const generateOvenExpress = (configs: GenerateOvenExpressConfigs | null): IRouter => {
  const router = Router();
  const fileData = new Map();

  if (!configs) {
    throw new Error('No configs provided');
  }

  Object.entries(configs.apis).map(([url, methodConfigs]) => {
    const newRouter = getPathRouter(url, methodConfigs, configs.defaultConfigs, fileData);
    router.use(newRouter);
  });

  return router;
};

export default generateOvenExpress;
