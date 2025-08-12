import { db, storage } from '@/firebase/client';
import {
  addDoc,
  collection,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import type { CardDoc, CardCondition, CardRarity } from '@/types/card';

type CreateCardInput = {
  uid: string;
  name: string;
  set: string;
  rarity: CardRarity;
  condition: CardCondition;
  valueEstimate: number;
};

export async function createCardDoc(input: CreateCardInput) {
  const { uid, name, set, rarity, condition, valueEstimate } = input;

  if (!uid) throw new Error('Missing uid');
  if (!name.trim()) throw new Error('Name is required');
  if (!set.trim()) throw new Error('Set is required');
  if (!Number.isFinite(valueEstimate) || valueEstimate < 0) {
    throw new Error('valueEstimate must be a non-negative number');
  }

  const col = collection(db, 'users', uid, 'cards');
  const partial: Omit<CardDoc, 'imageUrl'> & { imageUrl: string } = {
    name: name.trim(),
    set: set.trim(),
    rarity,
    condition,
    valueEstimate,
    imageUrl: '', // will be filled after upload
    createdAt: serverTimestamp(),
  };

  const refDoc = await addDoc(col, partial as CardDoc);
  return refDoc.id; // cardId
}

export async function uploadCardImageAndGetUrl(params: {
  uid: string;
  cardId: string;
  file: File | Blob;
}) {
  const { uid, cardId, file } = params;
  if (!uid || !cardId) throw new Error('Missing uid or cardId');
  if (!file) throw new Error('Missing file');

  // Storage path: cards/{uid}/{cardId}.jpg
  const storageRef = ref(storage, `cards/${uid}/${cardId}.jpg`);
  const task = uploadBytesResumable(storageRef, file);

  await new Promise<void>((resolve, reject) => {
    task.on('state_changed', undefined, reject, () => resolve());
  });

  const url = await getDownloadURL(storageRef);
  return url;
}

export async function attachImageUrlToCard(params: {
  uid: string;
  cardId: string;
  imageUrl: string;
}) {
  const { uid, cardId, imageUrl } = params;
  const cardRef = doc(db, 'users', uid, 'cards', cardId);
  await updateDoc(cardRef, { imageUrl });
}

export async function getUserCards(uid: string) {
  if (!uid) throw new Error('Missing uid');
  
  const cardsRef = collection(db, 'users', uid, 'cards');
  const snapshot = await getDocs(cardsRef);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as (CardDoc & { id: string })[];
}
