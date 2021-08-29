import { createDataAdapter, DataAdapter } from './create-data-adapter';

export const createDataAdapterStorage = () => {
  const map = new Map<string, DataAdapter<any>>();

  return {
    getAdapter<T = unknown>(jsonPath: string): DataAdapter<T> {
      if (map.has(jsonPath)) {
        return map.get(jsonPath)! as DataAdapter<T>;
      }

      const adapter = createDataAdapter<T>(jsonPath);
      map.set(jsonPath, adapter);

      return adapter;
    },
  };
};

export type DataAdapterStorage = ReturnType<typeof createDataAdapterStorage>;
