import { GetQuery } from "../queries/query";

export interface Entity<T> {
  create: (model?: any) => Promise<void>;
  read:  () => Promise<void>;
  update: (update?: any) => Promise<void>;
  delete: () => Promise<void>;
  patch: (update?: any) => Promise<void>;
  readMany: () => Promise<void>;
}
