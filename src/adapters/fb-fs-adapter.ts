import { raw } from "express";
import firebase from "firebase/compat";
import { DataAdapter, DocRef } from "../typing-utils/data-adapter";
import { IdType } from "../typing-utils/misc";
import { Optional } from "../typing-utils/typings";

type GetDocRefProps<T extends {}> = {
  idField: keyof T;
  id: string;
  collectionPath: string;
  item?: Optional<T>;
  shouldUpdateFile?: boolean;
}

interface FirebaseFirestoreAdapterOptions<T> {
  idField: keyof T;
  shouldUpdateFile?: boolean;
}

export const createFirebaseFirestoreAdapter = <T>(
  collectionPath: string,
  {
    idField,
    shouldUpdateFile = false,
  }: FirebaseFirestoreAdapterOptions<T>
): DataAdapter<T> => {
  const ref = (id: IdType) => getDocRef<T>({ id: id as string, idField, collectionPath, });

  const query = async () => {
    const collectionRef = await firebase
    .firestore()
    .collection(collectionPath)
    .get();

    const data = collectionRef.docs.map((doc) => doc.data() as T);

    return data.map((item) => getDocRef<T>({ id: item[idField] as unknown as string, item, idField, collectionPath, shouldUpdateFile }));
  }

  return {
    ref,
    query,
  }
}

const getDocRef = <T>({
  idField,
  id,
  item,
  collectionPath,
  shouldUpdateFile,
}: GetDocRefProps<T>): DocRef<T> => {
  let lastData: Optional<T> = item ?? null;
  let itemId = id ?? null;
  return ({
    get id() {
      return itemId;
    },
    set: async (newData: T) => {
      const dataRef = await firebase
      .firestore()
      .collection(collectionPath)
      .doc();

      lastData = { ...newData, [idField]: dataRef.id };
      shouldUpdateFile && await dataRef.set(lastData);
    },
    get: async () => {
      if (!itemId) {
        throw new Error('Cant perform get without id')
      }
      if (lastData) {
        return lastData;
      }

      const fsdata = await firebase
      .firestore()
      .collection(collectionPath)
      .doc(itemId)
      .get();

      lastData = fsdata.data() as T;
      return lastData;
    },
    delete: async () => {
      if (!itemId) {
        throw new Error('Cant perform delete without id')
      }
      const dataRef = await firebase
      .firestore()
      .collection(collectionPath)
      .doc(itemId);

      const deletingItem = lastData ? lastData : (await dataRef.get()).data() as T;
      lastData = null;

      shouldUpdateFile && dataRef.delete();
      return deletingItem;
    },
    update: async (partialData: Partial<T>) => {
      if (!itemId) {
        throw new Error('Cant perform update without id')
      }

      lastData = { ...item, ...partialData } as T;
      const dataRef = await firebase.firestore()
      .collection(collectionPath)
      .doc(itemId);

      shouldUpdateFile && await dataRef.update(lastData);
    },
  });
}
