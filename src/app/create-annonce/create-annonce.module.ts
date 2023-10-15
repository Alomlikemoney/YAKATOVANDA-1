import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateAnnoncePageRoutingModule } from './create-annonce-routing.module';

import { CreateAnnoncePage } from './create-annonce.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateAnnoncePageRoutingModule
  ],
  declarations: [CreateAnnoncePage]
})
export class CreateAnnoncePageModule {}
