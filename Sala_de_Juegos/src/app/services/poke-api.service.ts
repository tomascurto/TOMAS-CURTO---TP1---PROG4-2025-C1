import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PokeApiService {
  private baseUrl = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) {}

  getPokemon(nameOrId: string | number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/pokemon/${nameOrId}`);
  }

  getPokemonList(limit = 1025): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/pokemon?limit=${limit}`);
  }


  getEvolutionChain(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/evolution-chain/${id}`);
  }

  getPokemonSpecies(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/pokemon-species/${id}`);
  }

  getGeneration(idOrUrl: string | number): Observable<any> {
    const url = typeof idOrUrl === 'string' ? idOrUrl : `${this.baseUrl}/generation/${idOrUrl}`;
    return this.http.get<any>(url);
  }

  getMoveList(limit = 919): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/move?limit=${limit}`);
  }

  getMove(idOrName: number | string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/move/${idOrName}`);
  }

  getAbilityList(limit = 307): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/ability?limit=${limit}`);
  }

  getAbility(idOrName: number | string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/ability/${idOrName}`);
  }

  getEvolutionChains(): Observable<any[]> {
  return this.http.get<any>(`${this.baseUrl}/evolution-chain?limit=549`).pipe(
    map(response => response.results)
  );
}

}
