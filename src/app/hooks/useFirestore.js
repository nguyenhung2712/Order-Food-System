import React, { useState, useRef } from 'react';
import { db } from '../services/firebase/config';
import { getDocs, collection, query, orderBy, where, onSnapshot } from 'firebase/firestore';

const useFirestore = (collectionName, condition, isDescending = false) => {
    const [documents, setDocuments] = useState([]);
    const listenerRef = useRef(null);
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
                    createdAt: doc.data().createdAt ? doc.data().createdAt.toDate() : null
                }));
                documents.sort(function (a, b) {
                    if (isDescending) {
                        return new Date(b.createdAt) - new Date(a.createdAt);
                    } else {
                        return new Date(a.createdAt) - new Date(b.createdAt);
                    }
                });
                setDocuments(documents);
            });


        }
        fetchData();
        return () => {
            if (listenerRef.current) {
                listenerRef.current();
            }
        };
    }, [collectionName, condition]);

    return documents;
};

export default useFirestore;