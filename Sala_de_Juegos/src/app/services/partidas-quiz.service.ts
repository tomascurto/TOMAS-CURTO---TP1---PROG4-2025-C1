import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class PartidasQuizService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  async guardarPartida(puntuacion: number, tiempo: number): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) return;

    const partida = {
      uid: user.uid,
      puntuacion,
      tiempo,
      fecha: new Date()
    };

    const partidasRef = collection(this.firestore, 'partidasPokemonQuiz');
    await addDoc(partidasRef, partida);
    console.log('Partida guardada en Firebase:', partida);
  }
}
