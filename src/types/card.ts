export type CardDoc = {
    name: string;
    setName?: string;
    number?: string;
    rarity?: string;
    condition?: string;
    imageUrl?: string;
    purchasePrice?: number;
    notes?: string;
    createdAt: any; // Firestore Timestamp
    updatedAt: any; // Firestore Timestamp
  };