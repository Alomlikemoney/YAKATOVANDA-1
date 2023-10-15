import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GestAnnoncePageRoutingModule } from './gest-annonce-routing.module';

import { GestAnnoncePage } from './gest-annonce.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestAnnoncePageRoutingModule
  ],
  declarations: [GestAnnoncePage]
})
export class GestAnnoncePageModule {}
