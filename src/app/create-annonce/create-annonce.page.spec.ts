import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateAnnoncePage } from './create-annonce.page';

describe('CreateAnnoncePage', () => {
  let component: CreateAnnoncePage;
  let fixture: ComponentFixture<CreateAnnoncePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CreateAnnoncePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
