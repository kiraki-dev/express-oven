export interface ReadConfigs {
  paramMatch: Record<string, string>;
}

export interface Entity<T> {
  create: (model?: any) => Promise<void>;
  read:  (readConfigs?: ReadConfigs) => Promise<void>;
  update: (update?: any) => Promise<void>;
  delete: () => Promise<void>;
  patch: (update?: any) => Promise<void>;
  readMany: () => Promise<void>;
}
