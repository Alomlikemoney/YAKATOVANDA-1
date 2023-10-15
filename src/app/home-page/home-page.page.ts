import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { NewsService } from '../confirmed-data.service';
import { NewsItem } from '../news-item.model'; 
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, from, map, toArray } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { forkJoin } from 'rxjs';
import { ListResult, Reference } from '@angular/fire/compat/storage/interfaces';
import {ModalController } from '@ionic/angular'; // Importez ModalController
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.page.html',
  styleUrls: ['./home-page.page.scss'],
})

export class HomePage {
  userName: string = '';
  alerteAffichee: any;
  connexionReussie: any;
  alertconnect: any;
  confirmedFormDatas: any;
  annonces$!: Observable<any[]>; 
  newsItems: NewsItem[] = []; // Utilisez le modèle ici
  images$: Observable<any[]> | undefined;
  imagesRefs: Reference[] | undefined;
  imageUrls: Observable<string[]> | undefined;
  annonces!: Observable<any[]>;
 


  constructor(private router: Router,
    private route: ActivatedRoute,
    private storage: Storage,
    private alertController: AlertController, 
    private newsService: NewsService,
    private firestore: AngularFirestore,
    public afDB: AngularFireDatabase,
    private afStorage: AngularFireStorage,
    private modalController: ModalController,
    private navCtrl: NavController,
    private sharedService: SharedService 
    ) {
      this.storage.create();
    }
    ngOnInit() {
      this.annonces$ = this.firestore.collection('ANNONCES').valueChanges();

    }

   ionViewDidEnter() {
    this.newsService.getNews().subscribe((data) => {
      this.newsItems = data; // Assurez-vous que les données sont typées
    });
    }
    inscriptionReussie: boolean = false; // Par défaut, l'inscription n'est pas réussie

    async ionViewWillEnter() {
      this.inscriptionReussie = await this.storage.get('inscriptionReussie');
      this.userName = await this.storage.get('userName');
// Vérifiez si l'alerte a déjà été affichée
if (!this.alerteAffichee && this.inscriptionReussie) {
  this.presentCongratulationsAlert();
  this.alerteAffichee = true; // Marquez l'alerte comme affichée
}
}
 
async ionViewWillConnect(){
  this.connexionReussie= await this.storage.get('connexionReussie');
  if(!this.connexionReussie && !this.alertconnect){
    this.presentCongratulationsConnect();
    this.alertconnect = true;
  }
}
    
  goToLoginPage() {
    this.router.navigate(['/tabs/login-page']);
  }

  goToSignupPage() {
    this.router.navigate(['/tabs/signup-page']);
  }
  goToGestAnnoncePage() {
    this.router.navigate(['/tabs/create-annonce']);  }

  async presentCongratulationsAlert() {
    const alert = await this.alertController.create({
      header: 'Félicitations !',
      message: `Félicitations, ${this.userName} ! Votre inscription est réussie.`,
      buttons: ['OK']
    });
  
    await alert.present();
  }
  async presentCongratulationsConnect(){
    const alert = await this.alertController.create({
      header: 'Félicitations !',
      message: `! Connexion réussie.`,
      buttons: ['OK']
    });

    await alert.present();
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

    selectAnnonce(annonce: any) {
    // Ajoutez l'annonce sélectionnée à la liste à l'aide du service partagé
  this.sharedService.addSelectedAnnonce(annonce);
   

    // Utilisez la navigation pour accéder à gest-annonce
    this.router.navigate(['/tabs/gest-annonce']);
  }

}
 
