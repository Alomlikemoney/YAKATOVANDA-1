// shared.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private selectedAnnonces: any[] = []; // Stockez l'annonce sélectionnée

  constructor() {}

   // Ajoutez une annonce à la liste
  addSelectedAnnonce(annonce: any) {
    this.selectedAnnonces.push(annonce);
  }


  // Récupérez la liste d'annonces sélectionnées
  getSelectedAnnonces() {
    return this.selectedAnnonces;
  }
}
