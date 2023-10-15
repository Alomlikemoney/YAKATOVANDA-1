import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestAnnoncePage } from './gest-annonce.page';

const routes: Routes = [
  {
    path: '',
    component: GestAnnoncePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestAnnoncePageRoutingModule {}
