import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { AlertController } from '@ionic/angular';
import { FirebaseError } from 'firebase/app';
import firebase from 'firebase/compat';
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Importez AngularFirestore

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.page.html',
  styleUrls: ['./login-page.page.scss'],
})
export class LoginPagePage {
  emailOrPhone: string = '';
  password: string = '';
  errorMessage: string = '';
  userEmail: string = '';
  loginWith: string = 'email';

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router,
    private alertController: AlertController,
    private storage: Storage
  ) {
    this.afAuth.onAuthStateChanged((user) => {
      if (user) {
        // L'utilisateur est déjà connecté, redirigez-le vers la page d'accueil
        this.router.navigate(['/tabs/home-page']);
      }
    });
  }

  
  async login() {

    const identifier = this.loginWith === 'phone' ? `${this.emailOrPhone}@yka.com` : this.emailOrPhone;

    try {
      if (!this.emailOrPhone || !this.password) {
        this.errorMessage = 'Veuillez remplir tous les champs.';
        return;
      }

      let userCredential: { user: any; additionalUserInfo?: firebase.auth.AdditionalUserInfo | null | undefined; credential?: firebase.auth.AuthCredential | null; operationType?: string | null | undefined; };

      // Vérifier si l'entrée est un e-mail ou un numéro de téléphone
      if (this.emailOrPhone.includes('@')) {
        // C'est une adresse e-mail
        userCredential = await this.afAuth.signInWithEmailAndPassword(
          this.emailOrPhone,
          this.password
        );
      } else {
        // C'est un numéro de téléphone (ajout d'un domaine factice)
        userCredential = await this.afAuth.signInWithEmailAndPassword(
          `${this.emailOrPhone}@yka.com`,
          this.password
        );
      }

      if (userCredential.user) {
        this.userEmail = userCredential.user.email; 
        
        
    
           // Récupérez l'utilisateur actuellement connecté

           await this.storage.set('connexionReussie', true);
           this.userEmail = userCredential.user.email; // Stockez l'adresse e-mail ici
        // Stocker la confirmation de connexion dans Ionic Storage
     
        this.emailOrPhone='';
        this.password='';

        // Rediriger l'utilisateur vers la page d'accueil
        this.router.navigate(['/tabs/profil-page']);
      }
    } catch (error: any) {
      console.error(error); // Affichez l'erreur dans la console à des fins de débogage
  
      if (error instanceof FirebaseError) {
        // Gérez spécifiquement les erreurs Firebase ici
        if (error.code === 'auth/invalid-login-credentials') {
          this.errorMessage = 'Les informations de connexion ne sont pas valides. Veuillez réessayer.';
        } else {
          // Gérez d'autres erreurs Firebase ici, le cas échéant
          this.errorMessage = 'Une erreur s\'est produite lors de la connexion. Veuillez réessayer.';
        }
      } else {
        // Gérez les autres erreurs ici
        this.errorMessage = 'Une erreur inconnue s\'est produite. Veuillez réessayer.';
      }
    }
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Erreur',
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  getFirebaseErrorMessage(error: any): string {
    switch (error.code) {
      case 'auth/invalid-email':
        return 'L\'adresse e-mail est invalide.';
      case 'auth/user-not-found':
        return 'Aucun compte associé à cette adresse e-mail.';
      case 'auth/wrong-password':
        return 'Le mot de passe est incorrect.';
      case 'auth/weak-password':
        return 'Le mot de passe est trop faible. Il doit contenir au moins 6 caractères.';
      default:
        return 'Une erreur inconnue s\'est produite. Veuillez réessayer plus tard.';
    }
  }
  goToSignupPage() {
    this.router.navigate(['/tabs/signup-page']);
  }
  resetPassword() {
    if (!this.emailOrPhone) {
      this.errorMessage = 'Veuillez entrer votre identifiant (e-mail ou numéro de téléphone) pour réinitialiser le mot de passe.';
      return;
    }
  
    this.afAuth.sendPasswordResetEmail(this.emailOrPhone)
      .then(() => {
        this.errorMessage = 'Un e-mail de réinitialisation de mot de passe a été envoyé à votre adresse.';
      })
      .catch((error) => {
        this.errorMessage = 'Erreur lors de l\'envoi de l\'e-mail de réinitialisation de mot de passe : ' + error.message;
      });
  }
  
}

