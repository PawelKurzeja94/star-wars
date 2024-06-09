import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { By } from '@angular/platform-browser';

import { GameResultCardComponent } from './game-result-card.component';
import { Person, Starship } from '@shared/models';

describe('GameResultCardComponent', () => {
  let component: GameResultCardComponent;
  let fixture: ComponentFixture<GameResultCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatCardModule, MatProgressSpinnerModule, GameResultCardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameResultCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display spinner when loading', () => {
    component.loading = true;
    fixture.detectChanges();
    const spinner = fixture.debugElement.query(By.css('mat-spinner'));
    expect(spinner).toBeTruthy();
  });

  it('should display player data when playerData is available and not loading', () => {
    const playerData: Person = {
      name: 'Luke Skywalker',
      type: 'Person',
      mass: '77',
      height: '120',
      hair_color: 'test',
      skin_color: 'test',
      eye_color: 'test',
      birth_year: 'test',
      gender: 'test',
      created: '2024-01-01T00:00:00Z',
      edited: 'test',
      homeworld: 'test',
      url: 'test',
    };
    component.playerData = playerData;
    component.loading = false;
    fixture.detectChanges();
    const playerName = fixture.debugElement.query(By.css('div')).nativeElement.textContent;
    expect(playerName).toContain('Name: Luke Skywalker');
  });

  it('should display error message when showError is true and no playerData', () => {
    component.showError = true;
    component.playerData = null;
    component.loading = false;
    fixture.detectChanges();
    const errorMessage = fixture.debugElement.query(By.css('mat-card-content div')).nativeElement.textContent;
    expect(errorMessage).toContain('There was an error while downloading the data. Try again!');
  });

  it('should apply winning-card class when winningCard is true and not loading', () => {
    component.winningCard = true;
    component.loading = false;
    fixture.detectChanges();
    const card = fixture.debugElement.query(By.css('.card'));
    expect(card.classes['winning-card']).toBeTrue();
  });

  it('should display mass for person type', () => {
    const personData: Person = {
      name: 'Luke Skywalker',
      type: 'Person',
      mass: '77',
      height: '120',
      hair_color: 'test',
      skin_color: 'test',
      eye_color: 'test',
      birth_year: 'test',
      gender: 'test',
      created: '2024-01-01T00:00:00Z',
      edited: 'test',
      homeworld: 'test',
      url: 'test',
    };
    component.playerData = personData;
    component.loading = false;
    fixture.detectChanges();
    const mass = fixture.debugElement.query(By.css('.bold')).nativeElement.textContent;
    expect(mass).toContain('Mass: 77');
  });

  it('should display crew for starship type', () => {
    const starshipData: Starship = {
      name: 'Millennium Falcon',
      created: '2024-01-01T00:00:00Z',
      type: 'Starship',
      crew: '4',
      model: 'test',
      starship_class: 'test',
      manufacturer: 'test',
      cost_in_credits: 'test',
      length: 'test',
      passengers: 'test',
      max_atmosphering_speed: 'test',
      hyperdrive_rating: 'test',
      MGLT: 'test',
      cargo_capacity: 'test',
      consumables: 'test',
      pilots: [],
      edited: 'test',
      url: 'test',
    };
    component.playerData = starshipData;
    component.loading = false;
    fixture.detectChanges();
    const crew = fixture.debugElement.query(By.css('.bold')).nativeElement.textContent;
    expect(crew).toContain('Crew: 4');
  });
});
