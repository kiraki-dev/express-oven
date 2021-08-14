import { createDataAdapter, DataAdapter } from './create-data-adapter';

export const createDataAdapterStorage = () => {
  const map = new Map<string, DataAdapter<any>>();

  return {
    getAdapter(path: string): DataAdapter<any> {
      if (map.has(path)) {
        return map.get(path)!;
      }

      const adapter = createDataAdapter(path);
      map.set(path, adapter);

      return adapter;
    },
  };
};

export type DataAdapterStorage = ReturnType<typeof createDataAdapterStorage>;
