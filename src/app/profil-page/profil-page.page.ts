import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-profil-page',
  templateUrl: './profil-page.page.html',
  styleUrls: ['./profil-page.page.scss'],
})
export class ProfilPagePage {
  userProfile = {
    name: 'John Doe',
    phone1: '123-456-7890',
    phone2: '987-654-3210',
    createdDate: '01/15/2023',
    onlineStatus: true,
  };

  constructor(private navCtrl: NavController) {}

  logout() {
    // Code pour la déconnexion de l'utilisateur
    // Par exemple, vous pouvez mettre en œuvre votre logique de déconnexion ici
  }

  goToCreateAdPage() {
    // Rediriger l'utilisateur vers la page de création d'annonces
    this.navCtrl.navigateForward('/tabs/create-annonce');
  }
}
