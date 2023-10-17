import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-page-recherche',
  templateUrl: './page-recherche.page.html',
  styleUrls: ['./page-recherche.page.scss'],
})
export class PageRecherchePage {
  selectedChips: string[] = [];
  searchResults: any[] = [];
  searchQuery: string = '';

  constructor(private firestore: AngularFirestore) {}

  onChipSelect(chip: string) {
    if (this.selectedChips.includes(chip)) {
      this.selectedChips = this.selectedChips.filter((c) => c !== chip);
    } else {
      this.selectedChips.push(chip);
    }
  }

  performSearch() {
    // Utilisez les valeurs dans this.selectedChips pour construire la requête Firestore
    // Par exemple, pour une recherche basée sur le type "hotel" :
    this.firestore
      .collection('ANNONCES', (ref) => ref.where('type', '==', 'hotel'))
      .valueChanges()
      .subscribe((results) => {
        // Traitez les résultats ici, par exemple, mettez-les dans une propriété du composant
        this.searchResults = results;
      });
  }
  
  async onSearch() {
    if (this.searchQuery.trim() !== '') {
      this.firestore
        .collection('ANNONCES', (ref) =>
          ref
            .where('NomVendeur', '>=', this.searchQuery)
            .where('description', '<=', this.searchQuery + '\uf8ff')
            // Remplacez 'votreChampDeRecherche' par le nom du champ que vous souhaitez rechercher
        )
        .valueChanges()
        .subscribe((results) => {
          this.searchResults = results;
        });
    } else {
      this.searchResults = [];
    }
  }

  showDetails(result: any) {
    // Implémentez ici la logique pour afficher les détails de l'élément sélectionné.
    console.log('Détails de l\'élément :', result);
  }
  
}

