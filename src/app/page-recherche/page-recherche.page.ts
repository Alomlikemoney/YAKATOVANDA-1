import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs'; // Assurez-vous d'importer "of" depuis "rxjs"
import { SharedService } from '../shared.service';
import { NavController } from '@ionic/angular';
 // Exemple avec mergeMap (assurez-vous d'importer mergeMap depuis 'rxjs/operators')
 import { mergeMap } from 'rxjs/operators';
 import { map } from 'rxjs/operators';


@Component({
  selector: 'app-page-recherche',
  templateUrl: './page-recherche.page.html',
  styleUrls: ['./page-recherche.page.scss'],
})
export class PageRecherchePage {
  categories: string[] = ['Maison à vendre', 'Location', 'Vente', 'Bien immobilier', 'Maison', 'Hôtel', 'Terrain'];
  selectedCategory: string | null = null;
  searchQuery: string = '';
  annonces$: Observable<any[]> = of([]); // Initialisation avec un Observable vide
  imageUrls: Observable<string[]> | undefined;
  userImageUrls: string | undefined;


  constructor(private firestore: AngularFirestore,  
     private sharedService: SharedService,
     private navCtrl: NavController,) {}
    //  fonction de recherche depuis frestore
     onSearch() {
      const searchQueryLower = this.searchQuery.toLowerCase();
    
      this.annonces$ = this.firestore.collection('ANNONCES').valueChanges()
        .pipe(
          map((annonces: any[]) => {
            return annonces.filter(annonce => {
              const descriptionMatch = annonce.description && annonce.description.toLowerCase().includes(searchQueryLower);
              const nomVendeurMatch = annonce.Nomvendeur && annonce.Nomvendeur.toLowerCase().includes(searchQueryLower);
              const prixMatch = annonce.prix && annonce.prix.toString().includes(searchQueryLower);
              const quartierMatch = annonce.quartier && annonce.quartier.toLowerCase().includes(searchQueryLower);
              const paysMatch = annonce.pays && annonce.pays.toLowerCase().includes(searchQueryLower);
              const villeMatch = annonce.ville && annonce.ville.toLowerCase().includes(searchQueryLower);
              const phone1Match = annonce.phone1 && annonce.phone1.toString().includes(searchQueryLower);
              const phone2Match = annonce.phone2 && annonce.phone2.toString().includes(searchQueryLower);
              const phone3Match = annonce.phone3 && annonce.phone3.toString().includes(searchQueryLower);
              const statutMatch = annonce.statut && annonce.statut.toLowerCase().includes(searchQueryLower);
              
              return descriptionMatch || nomVendeurMatch || prixMatch || quartierMatch ||
                paysMatch || villeMatch || phone1Match || phone2Match || phone3Match || statutMatch;
            });
          })
        );
    }
    
    


    filterByCategory(category: string | null) {
      this.selectedCategory = category;
      this.onSearch();
    }

  selectCard(annonce: any) {
    // Ajoutez la carte sélectionnée au service partagé
    this.sharedService.addSelectedCard(annonce);

    // Redirigez vers la page gest-annonce
    this.navCtrl.navigateForward('/tabs/gest-annonce');
  }

  previewImage(imageUrl: string) {
    // Créer un élément d'image
    const preview = document.createElement('img');
    preview.src = imageUrl;
    preview.style.maxWidth = '100%';
    preview.style.maxHeight = '100%';
  
    // Créer une boîte de dialogue modale pour afficher l'image
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
  
    // Ajouter l'image à la boîte de dialogue modale
    modal.appendChild(preview);
  
    // Fermer la boîte de dialogue modale lorsqu'on clique dessus
    modal.addEventListener('click', () => {
      modal.remove();
    });
  
    // Ajouter la boîte de dialogue modale à la fin du corps du document
    document.body.appendChild(modal);
  }

}
