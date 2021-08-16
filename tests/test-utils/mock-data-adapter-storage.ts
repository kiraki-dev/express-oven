import { DataAdapterStorage } from '../../src/utils/create-data-adapter-storage';

export const getMockDataAdapterStorage = (initialData: any[] = []): DataAdapterStorage => {
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
  };

  return {
    getAdapter: jest.fn().mockReturnValue(mockAdapter),
  };
};
