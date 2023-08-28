import { db } from './firebase';
import {
  collection,
  addDoc,
  Timestamp /* query, where, writeBatch, getDocs */,
} from 'firebase/firestore';

export const addDocument = async (collectionName: string, data: any) => {
  const collectionRef = collection(db, collectionName);
  const now = new Date();
  const createdAt = Timestamp.fromDate(now);
  await addDoc(collectionRef, {
    ...data,
    createdAt,
  });
};
