import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.page.html',
  styleUrls: ['./signup-page.page.scss'],
})
export class SignupPagePage {
  firstName: string = '';
  lastName: string = '';
  phoneOrEmail: string = '';
  password: string = '';
  gender: string = '';
  inscriptionReussie: boolean = false; // Ajoutez une variable pour suivre si l'inscription est réussie
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private alertController: AlertController,
    private storage: Storage
  ) {}
  async ngOnInit() {
  await this.storage.create();
}


  async register() {
    if (!this.firstName || !this.lastName || !this.phoneOrEmail || !this.password || !this.gender) {
      this.presentAlert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    try {
      let userCredential;

      // Vérifier si l'entrée est un e-mail ou un numéro de téléphone
      if (this.phoneOrEmail.includes('@')) {
        // C'est une adresse e-mail
        userCredential = await this.afAuth.createUserWithEmailAndPassword(
          this.phoneOrEmail, // Utilisation de l'adresse e-mail
          this.password // Utilisation du mot de passe fourni
        );
      } else {
        // C'est un numéro de téléphone
        userCredential = await this.afAuth.createUserWithEmailAndPassword(
          `${this.phoneOrEmail}@myapp.com`, // Utilisation du numéro de téléphone (en ajoutant un domaine factice)
          this.password // Utilisation du mot de passe fourni
        );
      }

      if (userCredential.user) {
        await userCredential.user.updateProfile({
          displayName: this.firstName + ' ' + this.lastName,
        });
        console.log('Inscription réussie:', userCredential.user);
        this.firstName = '';
      this.lastName = '';
      this.phoneOrEmail = '';
      this.password = '';
      this.gender = '';

      // Stocker les valeurs dans Ionic Storage
      await this.storage.set('userName', userCredential.user.displayName);
      await this.storage.set('inscriptionReussie', true);

        this.router.navigate(['./tabs/home-page']);
      } else {
        this.presentAlert("L'inscription a réussi, mais userCredential.user est null.");
      }
    } catch (error: any) { // Spécifiez le type de 'error' comme 'any'
      let errorMessage = 'Erreur d\'inscription : ';

      if (error.code === 'auth/email-already-in-use') {
        errorMessage += 'L\'adresse e-mail est déjà utilisée.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage += 'L\'adresse e-mail est invalide.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage += 'Le mot de passe est trop faible.';
      } else {
        errorMessage += error.message || 'Une erreur inconnue s\'est produite.';
      }

      this.presentAlert(errorMessage);
    }
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Erreur',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }
  goToLoginPage() {
    this.router.navigate(['/tabs/signup-page']);
  }

  
}
