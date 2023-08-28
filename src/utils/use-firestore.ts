import React, { useState, useRef } from 'react';
import { db } from './firebase';

import {
  getDocs,
  collection,
  query,
  orderBy,
  where,
  onSnapshot,
} from 'firebase/firestore';

const useFirestore = (
  collectionName: string,
  condition?: any,
  isDescending: boolean = false
) => {
  const [documents, setDocuments] = useState<any>();
  const listenerRef = useRef(() => {});
  React.useEffect(() => {
    if (listenerRef.current) {
      listenerRef.current();
    }
    const fetchData = async () => {
      let collectionRef = collection(db, collectionName);
      let q = query(collectionRef);
      if (condition) {
        if (!condition.compareValue || !condition.compareValue.length) {
          setDocuments([]);
          return;
        }
        q = query(
          collectionRef,
          where(condition.fieldName, condition.operator, condition.compareValue)
        );
      }

      listenerRef.current = onSnapshot(q, (snapshot) => {
        const documents = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          createdAt: doc.data().createdAt
            ? doc.data().createdAt.toDate()
            : null,
        }));
        documents.sort(function (a: any, b: any) {
          let dateA = Date.parse(a.createdAt);
          let dateB = Date.parse(b.createdAt);
          if (isDescending) {
            return dateB - dateA;
          } else {
            return dateA - dateB;
          }
        });
        setDocuments(documents);
      });
    };
    fetchData();
    return () => {
      if (listenerRef.current) {
        listenerRef.current();
      }
    };
  }, [collectionName, condition, isDescending]);

  return documents;
};

export default useFirestore;
