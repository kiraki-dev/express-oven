import { ResponseModel } from './misc';

export interface DefaultConfigs {
  save: boolean;
  returnEntity: boolean;
  delay: number;
  handleFile: {
    directoryPath: string;
  };
  responseModel: ResponseModel;
}

export type PartialDefaultConfigs = Partial<DefaultConfigs>;
