import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { ApiResponse, Person, Starship } from '@shared/models';

@Injectable({
  providedIn: 'root',
})
export class StarWarsHttpService {
  private apiUrl = 'https://www.swapi.tech/api';

  constructor(private http: HttpClient) {}

  getPerson(id: number): Observable<ApiResponse<Person>> {
    return this.http.get<ApiResponse<Person>>(`${this.apiUrl}/people/${id}`).pipe(
      map(response => ({
        ...response,
        result: {
          ...response.result,
          properties: {
            ...response.result.properties,
            type: 'Person',
          } as Person,
        },
      })),
    );
  }

  getStarship(id: number): Observable<ApiResponse<Starship>> {
    return this.http.get<ApiResponse<Starship>>(`${this.apiUrl}/starships/${id}`).pipe(
      map(response => ({
        ...response,
        result: {
          ...response.result,
          properties: {
            ...response.result.properties,
            type: 'Starship',
          } as Starship,
        },
      })),
    );
  }
}
