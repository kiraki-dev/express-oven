import { Response } from "express";
import { ResponseModel } from '../typing-utils/misc';
import { setPropDeep } from './object-utils';

export interface ResponseModelBuilder {
  setData(data: any): void;
  write(res: Response): void;
}

export const createResponseBuilder = (responseModel: ResponseModel): ResponseModelBuilder => {
  let response: any;

  return {
    setData(data: any): void {
      response = setPropDeep(response, responseModel.paths.data, data);
    },
    write(res: Response) {
      response === undefined ? res.end() : res.send(response);
    }
  }
}
