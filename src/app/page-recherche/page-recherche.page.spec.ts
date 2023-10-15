import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageRecherchePage } from './page-recherche.page';

describe('PageRecherchePage', () => {
  let component: PageRecherchePage;
  let fixture: ComponentFixture<PageRecherchePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PageRecherchePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
