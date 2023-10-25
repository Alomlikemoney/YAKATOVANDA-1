export interface Annonce {
  id: string;
  title: string; 
  description: string;
  phone1: number;
  phone2?: number;
  phone3?: number;
  statut?: string;
  ville: string;
  pays: string;
  quartier: string;
  referenceAnnexes?: string;
  prix: number;
  prixStatus?: string;
  dateAnciennete: string;
  taille?: string;
  referenceAnnexesBien?: string;
  images: string[];
  userImageUrls: string[];
  confirmedFormDatas: string[];


  // Ajoutez ici d'autres propriétés nécessaires pour représenter un élément d'actualité
}
