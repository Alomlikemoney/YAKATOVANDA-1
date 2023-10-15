import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfilPagePage } from './profil-page.page';

const routes: Routes = [
  {
    path: '',
    component: ProfilPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilPagePageRoutingModule {}
