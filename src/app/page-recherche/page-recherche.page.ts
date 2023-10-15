import { Component } from '@angular/core';

@Component({
  selector: 'app-page-recherche',
  templateUrl: './page-recherche.page.html',
  styleUrls: ['./page-recherche.page.scss'],
})
export class PageRecherchePage {
  selectedChips: string[] = [];

  constructor() {}

  onChipSelect(chip: string) {
    if (this.selectedChips.includes(chip)) {
      this.selectedChips = this.selectedChips.filter((c) => c !== chip);
    } else {
      this.selectedChips.push(chip);
    }
  }
}

