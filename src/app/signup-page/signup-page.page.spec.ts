import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupPagePage } from './signup-page.page';

describe('SignupPagePage', () => {
  let component: SignupPagePage;
  let fixture: ComponentFixture<SignupPagePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SignupPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
