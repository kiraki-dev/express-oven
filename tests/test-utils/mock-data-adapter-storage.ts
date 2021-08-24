import { DataAdapterStorage } from '../../src/utils/create-data-adapter-storage';
import Mock = jest.Mock;

export type MockObj<T> = {
  [K in keyof T]: T[K] extends (...args: any) => any ? Mock<ReturnType<T[K]>, Parameters<T[K]>> : T[K];
};

export type MockDataAdapterStorage = {
  [K in keyof DataAdapterStorage]: Mock<MockObj<ReturnType<DataAdapterStorage[K]>>, Parameters<DataAdapterStorage[K]>>;
};

export const getMockDataAdapterStorage = (initialData: any[] = []): MockDataAdapterStorage => {
  const mockAdapter = {
    getAll: jest.fn().mockImplementation(() => initialData),
    addOne: jest.fn().mockImplementation((item: any) => {
      initialData.push(item);
      return item;
    }),
    updateOne: jest.fn().mockImplementation((predicate: (item: any) => boolean, item: any) => {
      initialData = initialData.map((current) => predicate(current) ? item : current);
      return item;
    }),
    deleteOne: jest.fn().mockImplementation((predicate: (item: any) => boolean, save: boolean) => {
      const itemToDelete = initialData.find(predicate);
      initialData = initialData.filter(item => item != itemToDelete);

      return itemToDelete ?? null;
    }),
    getOne: jest.fn().mockImplementation((predicate: (item: any) => boolean) => {
      return initialData.find(predicate) ?? null;
    }),
  } as const;

  return {
    getAdapter: jest.fn().mockReturnValue(mockAdapter),
  } as const;
};
