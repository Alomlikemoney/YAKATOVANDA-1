import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageRecherchePage } from './page-recherche.page';

const routes: Routes = [
  {
    path: '',
    component: PageRecherchePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageRecherchePageRoutingModule {}
