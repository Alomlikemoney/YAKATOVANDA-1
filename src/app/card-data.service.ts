import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class CardDataService {
  selectedAnnonces: any[] = [];

  constructor(private storage: Storage) {
    this.loadStoredData();
  }

  async loadStoredData() {
    await this.storage.create();
    const storedData = await this.storage.get('selectedAnnonces');
    if (storedData) {
      this.selectedAnnonces = storedData;
    }
  }

  async saveDataLocally() {
    await this.storage.create();
    await this.storage.set('selectedAnnonces', this.selectedAnnonces);
  }

  addCard(card: any) {
    this.selectedAnnonces.push(card);
    this.saveDataLocally();
  }

  removeCard(card: any) {
    const index = this.selectedAnnonces.indexOf(card);
    if (index > -1) {
      this.selectedAnnonces.splice(index, 1);
      this.saveDataLocally();
    }
  }

  getSelectedAnnonces() {
    return this.selectedAnnonces;
  }
}
