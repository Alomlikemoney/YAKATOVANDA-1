// registration-modal.component.ts

import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-registration-modal',
  templateUrl: 'registration-modal.component.html',
  styleUrls: ['registration-modal.component.scss'],
})
export class RegistrationModalComponent {
  userData: any = {};

  constructor(private modalController: ModalController) {}

  closeModal() {
    this.modalController.dismiss(this.userData);
  }
}
