import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { DataAdapter, DocRef } from "../typing-utils/data-adapter";
import { AndQuery, OrQuery } from "../queries/query";
import { Optional } from "../typing-utils/typings";
import { getFirebaseQuery } from "../queries/get-firebase-query";


type GetDocRefProps<T extends {}> = {
  idField: keyof T;
  id: string;
  collectionPath: string;
  item?: Optional<T>;
  shouldUpdateCollection?: boolean;
}

interface FirebaseFirestoreAdapterOptions<T> {
  idField: keyof T;
  shouldUpdateCollection?: boolean;
}

export const createFirestoreAdapter = <T extends {}>(
  firebaseConfig: Object,
  collectionPath: string,
  {
    idField,
    shouldUpdateCollection = false,
  }: FirebaseFirestoreAdapterOptions<T>
): DataAdapter<T> => {
  firebase.initializeApp(firebaseConfig);

  const ref = (id: any) => getDocRef<T>({ id, idField, collectionPath, shouldUpdateCollection });

  const query = async (query?: AndQuery | OrQuery | undefined) => {
    const collectionRef = firebase
    .firestore()
    .collection(collectionPath);

    if(query) {
      getFirebaseQuery(collectionRef, query)
    }
    const snapshot = await collectionRef.get();

    const data = snapshot.docs.map((doc) => doc.data() as unknown as T);

    return data.map((item) => getDocRef<T>({ id: item[idField] as unknown as string, item, idField, collectionPath, shouldUpdateCollection }));
  }

  return {
    ref,
    query,
  }
}

const getDocRef = <T extends {}>({
  idField,
  id,
  item,
  collectionPath,
  shouldUpdateCollection,
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
      itemId = dataRef.id;
      shouldUpdateCollection && await dataRef.set(lastData);
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

      shouldUpdateCollection && dataRef.delete();
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

      shouldUpdateCollection && await dataRef.update(lastData);
    },
  });
}
