import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NavController } from '@ionic/angular';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { SharedService } from '../shared.service';
import { ItemProfil } from '../item-profil';

@Component({
  selector: 'app-profil-page',
  templateUrl: './profil-page.page.html',
  styleUrls: ['./profil-page.page.scss'],
})
export class ProfilPagePage {
  userProfile = {
    name: '',
    phone1: '',
    phone2: '',
    createdDate: '',
    onlineStatus: true,
  };
  userImageUrls: string | undefined;
  userEmail: string = '';
  annonces$!: Observable<any[]>; 

  constructor( private navCtrl: NavController,
    private afAuth: AngularFireAuth,
    private storage: AngularFireStorage, // Injecte le service de stockage Firebase
    private firestore: AngularFirestore,
    private sharedService: SharedService ) {
    //Récupérez l'utilisateur actuellement connecté
  
  }

  
// infos personnelles
  ngOnInit() {
    
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        const userEmailFromAuth = user.email;
        if (userEmailFromAuth) {
          this.userEmail = userEmailFromAuth;
          if (userEmailFromAuth) {
            console.log('Adresse e-mail récupérée avec succès :', userEmailFromAuth);

            // Effectuer une requête Firestore pour récupérer les données de l'utilisateur correspondant à l'e-mail
            this.annonces$ = this.firestore.collection('users', (ref) =>
              ref.where('phoneOrEmail', '==', userEmailFromAuth)
            ).valueChanges();
          } else {
            console.error('Adresse e-mail invalide :', userEmailFromAuth);
          }
        }
      } else   {
        this.userEmail = '';
      }
    });
  }

  // images personnelles
    async FirstngOnInit() {

      this.afAuth.authState.subscribe(user => {
        if (user) {
          // L'utilisateur est connecté, vous pouvez accéder à son adresse e-mail ici
          const userEmailFromAuth = user.email;
          if (userEmailFromAuth) {
            // Vérifiez que l'adresse e-mail n'est pas null
            this.userEmail = userEmailFromAuth;
  
            // Vérifiez si userEmail contient une adresse e-mail valide
            if (this.isValidEmail(userEmailFromAuth)){
              console.log('Adresse e-mail récupérée avec succès :', userEmailFromAuth);
            // Supposons que tu aies stocké l'adresse e-mail de l'utilisateur dans userEmail
            this.firestore.collection('users', ref => ref.where('phoneOrEmail', '==', this.userEmail)).valueChanges().subscribe((userData: any[]) => {
              if (userData.length > 0) {
                // userData contient les informations de l'utilisateur, y compris les URLs des images de profil
                // Assure-toi que tu stockes ces URLs dans une variable pour les afficher plus tard dans le template
                this.userImageUrls = userData[0].imageUrls;
              }
            })
             }
          
            
            else {
              console.error('Adresse e-mail invalide :', userEmailFromAuth);
            }
          }
        } else {
          // L'utilisateur n'est pas connecté, userEmail sera une chaîne vide
          this.userEmail = '';
        }
      });

}

isValidEmail(input: string): boolean {
  // Expression régulière pour valider à la fois l'adresse e-mail et le numéro de téléphone
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneRegex = /^[0-9]{10}$/; // Par exemple, un numéro de téléphone à 10 chiffres

  // Vérifiez si l'input correspond à l'adresse e-mail ou au numéro de téléphone
  return emailRegex.test(input) || phoneRegex.test(input);
}

  async logout() {
    try {
      // Utilisez la méthode signOut() de AngularFireAuth pour vous déconnecter
      await this.afAuth.signOut();
      // Redirigez l'utilisateur vers la page de connexion ou une autre page de votre choix
      this.navCtrl.navigateRoot('/tabs/login-page'); // Remplacez '/login' par le chemin de votre page de connexion
    } catch (error) {
      console.error('Erreur de déconnexion :', error);
      // Gérez l'erreur ici, par exemple, en affichant un message à l'utilisateur
    }
  }

  goToCreateAdPage() {
    // Rediriger l'utilisateur vers la page de création d'annonces
    this.navCtrl.navigateForward('/tabs/create-annonce');
  }
}
