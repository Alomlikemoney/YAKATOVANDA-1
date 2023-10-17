import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class AnnonceService {
  confirmedFormDatas: any[] = [];

  constructor(private firestore: AngularFirestore) {}

  addConfirmedFormData(data: any, id: string) {
    // Stockez les données avec leur identifiant unique
    this.confirmedFormDatas.push({ data, id });
  }

  getConfirmedFormDatas() {
    return this.confirmedFormDatas;
  }

  // Méthode pour supprimer une ion-card par son identifiant unique
  deleteConfirmedFormById(documentId: string) {
    // Utilisez le nom de la collection spécifiée
    this.firestore.collection('ANNONCES').doc(documentId).delete()
      .then(() => {
        // Suppression réussie
        const index = this.confirmedFormDatas.findIndex((data) => data.data.documentId === documentId);
        if (index !== -1) {
          // Supprimez l'élément du tableau
          this.confirmedFormDatas.splice(index, 1);
        }
      })
      .catch((error) => {
        console.error('Erreur Firebase :', error);
        // Gérez l'erreur ici
      });
  }
}
