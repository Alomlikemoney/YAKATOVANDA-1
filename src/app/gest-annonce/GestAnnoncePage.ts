import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { SharedService } from '../shared.service';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-gest-annonce',
  templateUrl: './gest-annonce.page.html',
  styleUrls: ['./gest-annonce.page.scss'],
})
export class GestAnnoncePage implements OnInit {
  selectedAnnonces: any[] = [];
  annonces$!: Observable<any[]>; 
  userEmail: string = '';
  selectedCards: any[] = []; 

  [x: string]: any;
  local_announces: any[] = [];
  constructor(private storage: Storage,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
  ) { 
    
    this.loadSelectedCards();
    // Récupérez l'utilisateur actuellement connecté
    this.afAuth.authState.subscribe(user => {
      if (user) {
        // L'utilisateur est connecté, vous pouvez accéder à son adresse e-mail ici
        const userEmailFromAuth = user.email;
        if (userEmailFromAuth) {
          // Vérifiez que l'adresse e-mail n'est pas null
          this.userEmail = userEmailFromAuth;

          // Vérifiez si userEmail contient une adresse e-mail valide
          if (this.isValidEmail(userEmailFromAuth)) {
            console.log('Adresse e-mail récupérée avec succès :', userEmailFromAuth);
          } else {
            console.error('Adresse e-mail invalide :', userEmailFromAuth);
          }
        }
      } else {
        // L'utilisateur n'est pas connecté, userEmail sera une chaîne vide
        this.userEmail = '';
      }
    });
      this.storage.create();
    }


    ngOnInit() {
      this.sharedService.getSelectedCards().subscribe((cards) => {
        this.selectedCards = cards;
      });
    }
  
  
    // Vérifiez si une chaîne est une adresse e-mail valide
    isValidEmail(email: string): boolean {
      // Utilisez une expression régulière pour valider l'adresse e-mail
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(email);
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
    // Charger les annonces sélectionnées depuis le service lors de l'entrée dans la page
    this.loadSelectedCards();
  }

  async loadSelectedCards() {
    try {
      const cards = await this.sharedService.getSelectedCards().toPromise();
      this.selectedCards = cards || []; // Utilisez un tableau vide si cards est undefined
    } catch (error) {
      console.error('Erreur lors du chargement des cartes sélectionnées :', error);
    }
  }
  
  async supprimerCard(index: number) {
    try {
      // Appeler la méthode pour supprimer l'annonce du service en utilisant l'index
      await this.sharedService.supprimerSelectedCard(this.selectedCards[index]);
      
      // Mettre à jour la liste des annonces affichées dans le DOM
      this.selectedCards.splice(index, 1); // Supprimer l'annonce du tableau
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'annonce :', error);
    }
  }
}

