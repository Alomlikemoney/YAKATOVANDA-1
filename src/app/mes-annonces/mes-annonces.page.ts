import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { SharedService } from '../shared.service';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AnnonceService } from '../annonce-service.service';
import { ReversePipe } from './reverse.pipe';

@Component({
  selector: 'app-mes-annonces',
  templateUrl: './mes-annonces.page.html',
  styleUrls: ['./mes-annonces.page.scss'],
})
export class MesAnnoncesPage implements OnInit {
  selectedAnnonces: any[] = [];
  annonces$!: Observable<any[]>; 
  userEmail: string = '';
  selectedCards: any[] = []; 

  [x: string]: any;
  local_announces: any[] = [];
  confirmedFormDatas: any[] = [];

  constructor(private storage: Storage,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private annonceService: AnnonceService) {  
      
     }

      ngOnInit() {
  this.sharedService.getSelectedCards().subscribe((cards) => {
    this.selectedCards = cards;
  });

  // Triez confirmedFormDatas par dateAnciennete en ordre décroissant
  this.confirmedFormDatas.sort((a, b) => {
    return new Date(b.dateAnciennete).getTime() - new Date(a.dateAnciennete).getTime();
  });
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
      
      ionViewWillEnter() {
        // Obtenez les annonces sauvegardées en local
        this.storage.get('annonces').then((annonces: any[]) => {
          if (annonces) {
            this.confirmedFormDatas = annonces;
          }
        });
      }
// Fonction pour supprimer une ion-card spécifique par son ID unique
async deleteIonCard(documentId: string) {
   console.log('Suppression d\'ion-card avec documentId :', documentId);
  // Supprimez l'ion-card de Firestore
  if(documentId){
    await this.firestore.collection('ANNONCES').doc(documentId).delete();
    console.log(documentId)
  
  }

  // Supprimez l'ion-card du stockage local
  const annonces = await this.storage.get('annonces');
  if (annonces) {
    const updatedAnnonces = annonces.filter((annonce: { documentId: string; }) => annonce.documentId !== documentId);
    await this.storage.set('annonces', updatedAnnonces);
  }

  // Supprimez l'ion-card du DOM en utilisant son ID unique
  const ionCardElement = document.getElementById(documentId);
  if (ionCardElement) {
    ionCardElement.remove();
  }
}

}
