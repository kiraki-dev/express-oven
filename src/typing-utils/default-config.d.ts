import { ResponseModel } from './misc';

export interface DefaultConfigs {
  save: boolean;
  returnEntity: boolean;
  delay: number;
  responseModel: ResponseModel;
}

export type PartialDefaultConfigs = Partial<DefaultConfigs>;
