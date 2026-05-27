export interface MedicineData {
  identified: boolean;
  name: string;
  composition: string[];
  usage: string;
  dosage: string;
  sideEffects: string[];
  precautions: string[];
  alternatives: string[];
  safetyRating: string;
  purchaseQuery: string;
}
