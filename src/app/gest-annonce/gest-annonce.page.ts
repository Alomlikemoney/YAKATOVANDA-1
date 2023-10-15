import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { SharedService } from '../shared.service';
import { ActivatedRoute } from '@angular/router'; // Im

@Component({
  selector: 'app-gest-annonce',
  templateUrl: './gest-annonce.page.html',
  styleUrls: ['./gest-annonce.page.scss'],
})
export class GestAnnoncePage implements OnInit {
  selectedAnnonces: any[] = [];

  [x: string]: any;
  local_announces: any[] = []; 
  constructor(private storage: Storage,  private route: ActivatedRoute, private sharedService: SharedService ) { // Créez une instance de Ionic Storage
    
  }

    
  ngOnInit() {
    
    // Récupérez la liste d'annonces sélectionnées à partir du service partagé
    this.selectedAnnonces = this.sharedService.getSelectedAnnonces();
    console.log('Annonces sélectionnées récupérées :', this.selectedAnnonces);
    // Enregistrez les données dans le stockage local pour une utilisation future
    this.saveDataLocally();
    this.getFromLocalStorage()
  }

  saveDataLocally() {
    // Utilisez le service Storage pour enregistrer les données localement
    this.storage.set('selectedAnnonce', this.selectedAnnonces).then(() => {
      console.log('Données des ion-card sauvegardées localement avec succès.', this.selectedAnnonces);
    });

 
  }
  getFromLocalStorage() {
    this.storage.get('selectedAnnonce').then((data) => {
      if (data && data.length > 0) { // Vérifiez si data existe et s'il contient des éléments
        this.selectedAnnonces = this.selectedAnnonces.concat(data);        console.log('Données des ion-card récupérées localement avec succès :', data);
        // Faites ce que vous souhaitez avec les données récupérées ici
      } else {
        console.log('Aucune donnée des ion-card trouvée localement ou le tableau est vide.');
      }
    });
  }
  
  // Reste de votre code...

  // Fonction de suppression d'annonce
  supprimerAnnonce(annonce: any) {
    // Supprimez l'annonce du tableau
    const index = this.selectedAnnonces.indexOf(annonce);

    if (index !== -1) {
      this.selectedAnnonces.splice(index, 1);

      // Mettez à jour les annonces dans le stockage local après la suppression
      this.saveDataLocally();
    }
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
function concat(data: any): any[] {
  throw new Error('Function not implemented.');
}

