import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.page.html',
  styleUrls: ['./signup-page.page.scss'],
})
export class SignupPagePage {
  firestoreCollection: string = 'users';
  images: File[] = [];
  selectedImage: File[] = [];
  selectedImageURL: string | undefined;
  firstName: string = '';
  lastName: string = '';
  phoneOrEmail: string = '';
  password: string = '';
  gender: string = '';
  inscriptionReussie: boolean = false;
  formConfirmed = false;
  confirmedFormDatas: any[] = [];
  resetForm: any;
  imageUrls: string[] = [];
  emailOrPhones: any;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private alertController: AlertController,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
  ) {
    this.images = [];
  }

  async ngOnInit() {}

  async register() {
    this.images = this.selectedImage;

    if (!this.firstName || !this.lastName || !this.phoneOrEmail || !this.password || !this.gender || !this.images) {
      this.presentAlert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    try {
      let userCredential;

      if (this.phoneOrEmail.includes('@')) {
        userCredential = await this.afAuth.createUserWithEmailAndPassword(
          this.phoneOrEmail,
          this.password
        );
      } else {
        userCredential = await this.afAuth.createUserWithEmailAndPassword(
          this.emailOrPhones =`${this.phoneOrEmail}@yka.com`,
          this.password
        );
      }

      if (userCredential.user) {

        // this.firestore.collection('users').doc(userCredential.user.uid).set({
        //   phoneOrEmail: this.emailOrPhones, // Utilisez l'adresse e-mail ou le numéro de téléphone modifié
        // });
        
        await userCredential.user.updateProfile({
          displayName: this.firstName + ' ' + this.lastName,
        });

        const imageUrls = await this.uploadImages(this.images);

        await this.firestore.collection(this.firestoreCollection).add({
          firstName: this.firstName,
          lastName: this.lastName,
          phoneOrEmail: this.emailOrPhones,
          gender: this.gender,
          imageUrls: imageUrls,

        });

        this.presentAlert('Inscription réussie!');
        this.router.navigate(['./tabs/home-page']);
      } else {
        this.presentAlert("L'inscription a réussi, mais userCredential.user est null.");
      }
    } catch (error: any) {
      let errorMessage = 'Erreur d\'inscription : ';

      if (error.code === 'auth/email-already-in-use') {
        errorMessage += 'L\'adresse e-mail est déjà utilisée.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage += 'L\'adresse e-mail ou le numero est invalide.';
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
      header: 'Message',
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = [file];
      this.selectedImageURL = URL.createObjectURL(file);
      this.images = [file];
    }
  }

  async uploadImages(images: File[]): Promise<string[]> {
    const imageUrls: string[] = [];

    for (const image of images) {
      const timestamp = new Date().getTime();
      const fileName = `${this.phoneOrEmail}_${timestamp}_${image.name}`;
      const filePath = `profile_images/${fileName}`;

      const task = this.storage.upload(filePath, image);

      await task.then(async (snapshot) => {
        if (snapshot.state === 'success') {
          const downloadURL = await snapshot.ref.getDownloadURL();
          imageUrls.push(downloadURL);
        }
      });
    }

    return imageUrls;
  }

  goToLoginPage() {
    this.router.navigate(['/tabs/login-page']);
  }
}
