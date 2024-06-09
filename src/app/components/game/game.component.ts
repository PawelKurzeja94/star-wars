import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';

import { GameDataType } from '@shared/models/game-data.type';
import { GameResult, GameStateService } from './game.state';
import { GameResultCardComponent } from '../game-result-card/game-result-card.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [MatButtonModule, CommonModule, GameResultCardComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent {
  private gameStateService = inject(GameStateService);

  GameResult = GameResult;

  game$ = this.gameStateService.selectGame();

  playerOneGameState$ = this.gameStateService.selectPlayerOneGameState();
  playerTwoGameState$ = this.gameStateService.selectPlayerTwoGameState();

  gameLoading$ = this.gameStateService.selectGameLoading();
  gameResult$ = this.gameStateService.selectGameResult();
  gameScore$ = this.gameStateService.selectGameScore();
  selectGameType$ = this.gameStateService.selectGameType();

  start(gameType: GameDataType) {
    this.gameStateService.startNewRound(gameType);
  }
}
