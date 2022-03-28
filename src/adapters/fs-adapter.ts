import {DataAdapter, DocRef} from '../typing-utils/data-adapter';
import {resolveProjectPath} from '../utils/path-utils';
import {readFile, writeFile} from 'fs/promises';
import {Optional} from '../typing-utils/typings';
import {IdType} from "../typing-utils/misc";

type KeyWithIdValue<T, K extends keyof T = keyof T> = T[K] extends IdType ? K : never;

interface CreateFsAdapterOptions<T> {
  idField: KeyWithIdValue<T>;
  shouldUpdateFile?: boolean;
}

interface FileDataApi<T> {
  read(): Promise<T[]>;

  write(value: T[]): Promise<void>;
}

// private
const createFileDataApi = <T>(path: string, shouldUpdateFile: boolean): FileDataApi<T> => {
  const finalPath = resolveProjectPath(path);

  let data: Optional<T[]> = null;

  const read = async (): Promise<T[]> => {
    if (data) {
      return data;
    }
    const jsonStr = await readFile(finalPath, {encoding: 'utf-8'});
    data = JSON.parse(jsonStr || '[]') as T[];
    return data;
  };

  const write = async (value: T[]): Promise<void> => {
    data = value;
    shouldUpdateFile && await writeFile(finalPath, JSON.stringify(data, null, 2));
  };

  return {
    read,
    write,
  }
}

export const createFsAdapter = <T extends Record<any, any>>(
  jsonPath: string,
  {
    idField,
    shouldUpdateFile = false,
  }: CreateFsAdapterOptions<T>
): DataAdapter<T> => {
  const fileDataApi = createFileDataApi<T>(jsonPath, shouldUpdateFile);

  const query = async () => {
    const data = await fileDataApi.read() as T[];
    return data.map((item) => {
      const id = item[idField];

      return getDocRef({
        idField,
        item,
        id,
      }, fileDataApi);
    });
  };

  const createRefWithId = (id: any) => getDocRef({idField, id}, fileDataApi);

  return {
    query,
    ref: createRefWithId,
  }
}

type GetDocRefProps<T extends {}> = Pick<CreateFsAdapterOptions<T>, 'shouldUpdateFile'> & {
  idField: keyof T;
  id: IdType;
  item?: Optional<T>
}

const getDocRef = <T>({
  idField,
  id,
  item,
}: GetDocRefProps<T>, api: FileDataApi<T>): DocRef<T> => {
  let lastData: Optional<T> = item ?? null;

  return ({
    id,
    set: async (newData: T) => {
      const data = await api.read();
      const updatedData = data.map((current) => (current[idField] as any) === id ? newData : current);
      await api.write(updatedData);
      lastData = newData;
    },
    get: async () => {
      if (lastData) {
        return lastData;
      }
      const data = await api.read();
      lastData = data.find((d: T) => (d[idField] as any) === id) as T;
      return lastData;
    },
    delete: async () => {
      const data = await api.read();
      const updatedData = data.filter((current) => (current[idField] as any) !== id);
      await api.write(updatedData);
      const deletingItem = lastData ? lastData : data.find((d: T) => (d[idField] as any) === id) as T;
      lastData = null;
      return deletingItem;
    },
    update: async (partialData: Partial<T>) => {
      const newData = {...item, ...partialData} as T;
      const data = await api.read();
      const updatedData = data.map((current) => (current[idField] as any) === id ? newData : current);
      await api.write(updatedData);
      lastData = newData;
    },

  });
}
