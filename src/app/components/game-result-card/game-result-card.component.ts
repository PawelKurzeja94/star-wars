import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Person, Starship } from '@shared/models';

@Component({
  selector: 'app-game-result-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressSpinnerModule],
  templateUrl: './game-result-card.component.html',
  styleUrl: './game-result-card.component.scss',
})
export class GameResultCardComponent {
  @Input() playerData!: Person | Starship | null;
  @Input() loading?: boolean;
  @Input() showError?: boolean;
  @Input() winningCard?: boolean;
}
