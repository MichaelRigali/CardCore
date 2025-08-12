export type CardCondition = 'NM' | 'LP' | 'MP' | 'HP' | 'DMG';
export type CardRarity =
  | 'Common'
  | 'Uncommon'
  | 'Rare'
  | 'Rare Holo'
  | 'Ultra Rare'
  | 'Secret Rare';

export interface CardDoc {
  name: string;
  set: string;              // e.g., "Base Set"
  rarity: CardRarity;
  condition: CardCondition;
  valueEstimate: number;    // stored as number in Firestore
  imageUrl: string;         // Firebase Storage download URL
  createdAt: any;           // Firestore Timestamp (serverTimestamp)
}