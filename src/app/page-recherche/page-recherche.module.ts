import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PageRecherchePageRoutingModule } from './page-recherche-routing.module';

import { PageRecherchePage } from './page-recherche.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PageRecherchePageRoutingModule
  ],
  declarations: [PageRecherchePage]
})
export class PageRecherchePageModule {}
