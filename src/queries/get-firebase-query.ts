import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

import { AndQuery, OrQuery } from "./query";

export const getFirebaseQuery = (collectionRef: firebase.firestore.CollectionReference, query: AndQuery | OrQuery) => {
    if (Array.isArray(query)) {
        throw new Error("`Or` query is not supported in firebase adatper")
    } else {
        for (const [prop, rightObj] of Object.entries(query)) {
            collectionRef.where(prop, rightObj.operation, rightObj.paramValue);
        }
    }
}
