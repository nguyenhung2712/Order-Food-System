import firebase, { db } from './config';
import { collection, addDoc, Timestamp, query, where, writeBatch, getDocs } from 'firebase/firestore';

export const addDocument = async (collectionName, data) => {
    const collectionRef = collection(db, collectionName);
    const now = new Date();
    const createdAt = Timestamp.fromDate(now);
    await addDoc(collectionRef, {
        ...data,
        createdAt
    });
};

export const updateDocuments = async (collectionName, condition, data) => {
    const collectionRef = collection(db, collectionName);
    const querySnapshot = await getDocs(
        query(
            collectionRef,
            where(condition.fieldName, condition.operator, condition.compareValue)
        )
    );

    const batch = writeBatch(db);
    querySnapshot.forEach((doc) => {
        batch.update(doc.ref, data);
    });

    await batch.commit();
}

export const insertField = async (collectionName, id, fieldId) => {
    /* const collectionRef = collection(db, collectionName);
    const now = new Date();
    const createdAt = Timestamp.fromDate(now);
    await addDoc(collectionRef, {
        ...data,
        createdAt
    }); */
};

/* export const getDocs = async (collection, id) => {
    const query = db.collection(collection);
    await query.doc(id).get()
        .then((snapshot) => {
            if (snapshot.data()) {
                return true;
            }
            return false;
        });
}; */

// tao keywords cho displayName, su dung cho search
export const generateKeywords = (displayName) => {
    // liet ke tat cac hoan vi. vd: name = ["David", "Van", "Teo"]
    // => ["David", "Van", "Teo"], ["David", "Teo", "Van"], ["Teo", "David", "Van"],...
    const name = displayName.split(' ').filter((word) => word);

    const length = name.length;
    let flagArray = [];
    let result = [];
    let stringArray = [];

    /**
     * khoi tao mang flag false
     * dung de danh dau xem gia tri
     * tai vi tri nay da duoc su dung
     * hay chua
     **/
    for (let i = 0; i < length; i++) {
        flagArray[i] = false;
    }

    const createKeywords = (name) => {
        const arrName = [];
        let curName = '';
        name.split('').forEach((letter) => {
            curName += letter;
            arrName.push(curName);
        });
        return arrName;
    };

    function findPermutation(k) {
        for (let i = 0; i < length; i++) {
            if (!flagArray[i]) {
                flagArray[i] = true;
                result[k] = name[i];

                if (k === length - 1) {
                    stringArray.push(result.join(' '));
                }

                findPermutation(k + 1);
                flagArray[i] = false;
            }
        }
    }

    findPermutation(0);

    const keywords = stringArray.reduce((acc, cur) => {
        const words = createKeywords(cur);
        return [...acc, ...words];
    }, []);

    return keywords;
};

