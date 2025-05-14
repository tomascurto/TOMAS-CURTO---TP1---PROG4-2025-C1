// ranking.service.ts
import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, query, where, orderBy } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RankingService {
  constructor(private firestore: Firestore) {}

  getAhorcadoRanking(): Observable<any[]> {
    const ref = collection(this.firestore, 'partidasAhorcado');
    return collectionData(ref, { idField: 'id' }).pipe(
      map((data: any[]) =>
        data.sort((a, b) => {
          if (a.resultado !== b.resultado) return b.resultado - a.resultado;
          if (a.duracionSegundos !== b.duracionSegundos) return a.duracionSegundos - b.duracionSegundos;
          if (a.vidasRestantes !== b.vidasRestantes) return b.vidasRestantes - a.vidasRestantes;
          if (a.letrasSeleccionadas !== b.letrasSeleccionadas) return b.letrasSeleccionadas - a.letrasSeleccionadas;
          return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
        })
      )
    );
  }

  getMoMRanking(): Observable<any[]> {
    const ref = collection(this.firestore, 'partidasMoM');
    return collectionData(ref, { idField: 'id' }).pipe(
      map((data: any[]) =>
        data.sort((a, b) => {
          if (a.aciertos !== b.aciertos) return b.aciertos - a.aciertos;
          if (a.tiempo !== b.tiempo) return a.tiempo - b.tiempo;
          return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
        })
      )
    );
  }

  getPokemonQuizRanking(): Observable<any[]> {
    const ref = collection(this.firestore, 'partidasPokemonQuiz');
    return collectionData(ref, { idField: 'id' }).pipe(
      map((data: any[]) =>
        data.sort((a, b) => {
          if (a.puntuacion !== b.puntuacion) return b.puntuacion - a.puntuacion;
          if (a.tiempo !== b.tiempo) return a.tiempo - b.tiempo;
          return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
        })
      )
    );
  }

  getPokerRanking(): Observable<any[]> {
    const ref = collection(this.firestore, 'partidas_poker');
    return collectionData(ref, { idField: 'id' }).pipe(
      map((data: any[]) =>
        data.sort((a, b) => {
          if (a.puntaje !== b.puntaje) return b.puntaje - a.puntaje;
          if (a.tiempo !== b.tiempo) return a.tiempo - b.tiempo;
          return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
        })
      )
    );
  }
}
