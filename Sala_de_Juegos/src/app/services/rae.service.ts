import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

interface RAEWord {
  word: string;
  definition: string;
}

@Injectable({
  providedIn: 'root'
})
export class RaeService {
  private apiUrl = 'https://random-word-api.herokuapp.com/word?lang=es';

  constructor(private http: HttpClient) {}

  getRandomWord(): Observable<string> {
    return this.http.get<string[]>(this.apiUrl).pipe(
      map(words => words[0])
    );
  }
}
