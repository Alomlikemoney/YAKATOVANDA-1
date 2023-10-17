import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular'; // Importez Storage
import { BehaviorSubject } from 'rxjs';
import { Annonce } from './item-id';

@Injectable({
  providedIn: 'root'
})
export class SharedService { 
  
  selectedCards: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor(private storage: Storage) {
    this.initializeStorage();
  }

  private async initializeStorage() {
    await this.storage.create();
    const cards = await this.storage.get('selectedCards');
    if (cards) {
      this.selectedCards.next(cards);
    }
  }

  async addSelectedCard(card: any) {
    const currentCards = this.selectedCards.value;
    currentCards.push(card);
    this.selectedCards.next(currentCards);
    await this.saveSelectedCards(currentCards);
  }

  private async saveSelectedCards(cards: any[]) {
    await this.storage.set('selectedCards', cards);
    console.log(cards);
  }

  getSelectedCards() {
    return this.selectedCards.asObservable();
  }

  async clearSelectedCards() {
    this.selectedCards.next([]);
    await this.storage.remove('selectedCards');
  }
  
  async supprimerSelectedCard(annonce: any) {
    try {
      // Charger les annonces sélectionnées depuis le stockage
      const selectedCards: Annonce[] = await this.storage.get('selectedCards');
  
      // Supprimer l'annonce spécifiée de la liste
      const updatedCards = selectedCards.filter(selectedAnnonce => selectedAnnonce.id !== annonce.id);
  
      // Sauvegarder la liste mise à jour dans le stockage
      await this.storage.set('selectedCards', updatedCards);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'annonce dans le stockage :', error);
    }
  }
  
  
}
