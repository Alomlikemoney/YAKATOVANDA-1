import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfilPagePage } from './profil-page.page';

describe('ProfilPagePage', () => {
  let component: ProfilPagePage;
  let fixture: ComponentFixture<ProfilPagePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ProfilPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
