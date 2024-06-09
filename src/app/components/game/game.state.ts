import { Injectable, inject } from '@angular/core';

import { BehaviorSubject, Observable, Subject, catchError, exhaustMap, forkJoin, tap, withLatestFrom } from 'rxjs';

import { StarWarsHttpService } from '@core/http/star-wars-http.service';
import { replaceHttpErrorWithNull } from '@shared/utils/replace-error-with-null';
import { ApiResponse, Person, Starship } from '@shared/models';
import { GameDataType } from '@shared/models/game-data.type';
import { PlayerData } from '@shared/models/player-data';
import { getRandomNumber } from '@shared/utils/random-number';
import { isPerson, isStarship } from '@shared/utils/type-guards';

export interface PlayerGameState {
  loading: boolean;
  data: PlayerData | null;
}

export interface GameScore {
  playerOne: number;
  playerTwo: number;
}

export enum GameResult {
  INITIAL = 'Initial',
  P1WINS = 'P1WINS',
  P2WINS = 'P2WINS',
  DRAW = 'Draw',
  CALCULATING = 'Calculating',
  ERROR = 'Error',
}

@Injectable({ providedIn: 'root' })
export class GameStateService {
  private starWarsHttpService = inject(StarWarsHttpService);

  private gameLoading$ = new BehaviorSubject<boolean>(false);
  private newGameTrigger$ = new Subject<GameDataType>();
  private playerOneGameState$ = new BehaviorSubject<PlayerGameState>({ data: null, loading: false });
  private playerTwoGameState$ = new BehaviorSubject<PlayerGameState>({ data: null, loading: false });
  private gameResult$ = new BehaviorSubject<GameResult>(GameResult.INITIAL);
  private gameScore$ = new BehaviorSubject<GameScore>({
    playerOne: 0,
    playerTwo: 0,
  });

  // SELECTORS

  // SUBSCRIBE HERE TO START THE GAME
  selectGame() {
    return this.newGameTrigger$.asObservable().pipe(
      tap(() => {
        this.gameLoading$.next(true);
        this.setLoadingState(this.playerOneGameState$, this.playerTwoGameState$);
      }),
      exhaustMap(gameType => {
        const fetchPlayerOneData = gameType === 'Person' ? this.getPlayerData('Person') : this.getPlayerData('Starship');
        const fetchPlayerTwoData = gameType === 'Person' ? this.getPlayerData('Person') : this.getPlayerData('Starship');
        return forkJoin([fetchPlayerOneData, fetchPlayerTwoData]).pipe(withLatestFrom(this.gameScore$));
      }),
      tap(([[playerOne, playerTwo], gameScore]) => {
        const playerOneResult = playerOne?.result.properties || null;
        const playerTwoResult = playerTwo?.result.properties || null;

        this.playerOneGameState$.next({ loading: false, data: playerOneResult });
        this.playerTwoGameState$.next({ loading: false, data: playerTwoResult });

        const result = this.resolveResult(playerOneResult, playerTwoResult);

        this.gameResult$.next(result);

        if (result === GameResult.P1WINS) this.gameScore$.next({ ...gameScore, playerOne: gameScore.playerOne + 1 });
        if (result === GameResult.P2WINS) this.gameScore$.next({ ...gameScore, playerTwo: gameScore.playerTwo + 1 });

        this.gameLoading$.next(false);
      }),
    );
  }

  selectPlayerOneGameState(): Observable<PlayerGameState> {
    return this.playerOneGameState$.asObservable();
  }

  selectPlayerTwoGameState(): Observable<PlayerGameState> {
    return this.playerTwoGameState$.asObservable();
  }

  selectGameLoading(): Observable<boolean> {
    return this.gameLoading$.asObservable();
  }

  selectGameType(): Observable<GameDataType> {
    return this.newGameTrigger$.asObservable();
  }

  selectGameScore(): Observable<GameScore> {
    return this.gameScore$.asObservable();
  }

  selectGameResult(): Observable<GameResult> {
    return this.gameResult$.asObservable();
  }

  // EFFECTS
  startNewRound(gameType: GameDataType): void {
    this.newGameTrigger$.next(gameType);
  }

  private getPlayerData(gameType: GameDataType): Observable<ApiResponse<Person | Starship> | null> {
    return gameType === 'Person'
      ? this.starWarsHttpService.getPerson(getRandomNumber(15)).pipe(catchError(replaceHttpErrorWithNull))
      : this.starWarsHttpService.getStarship(getRandomNumber(15)).pipe(catchError(replaceHttpErrorWithNull));
  }

  // METHODS
  private resolveResult(playerOne: Person | Starship | null, playerTwo: Person | Starship | null): GameResult {
    if (!playerOne || !playerTwo) {
      return GameResult.ERROR;
    }

    if (isPerson(playerOne) && isPerson(playerTwo)) {
      if (playerOne.mass === 'unknown' || playerTwo.mass === 'unknown') return GameResult.DRAW;
      return this.calculateGameResult(Number(playerOne.mass), Number(playerTwo.mass));
    }

    if (isStarship(playerOne) && isStarship(playerTwo)) {
      if (playerOne.crew === 'unknown' || playerTwo.crew === 'unknown') return GameResult.DRAW;
      return this.calculateGameResult(Number(playerOne.crew.replace(',', '.')), Number(playerTwo.crew.replace(',', '.')));
    }

    return GameResult.CALCULATING;
  }

  private calculateGameResult(playerOneValue: number, playerTwoValue: number): GameResult {
    return playerOneValue > playerTwoValue ? GameResult.P1WINS : playerTwoValue > playerOneValue ? GameResult.P2WINS : GameResult.DRAW;
  }

  private setLoadingState(...subjects: BehaviorSubject<PlayerGameState>[]): void {
    subjects.forEach(subject => subject.next({ loading: true, data: null }));
  }
}
