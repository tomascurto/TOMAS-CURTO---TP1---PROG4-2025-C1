import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class PartidasPokerService {
  firestore = inject(Firestore);
  auth = inject(Auth);

  async guardarPartida(puntaje: number, tiempo: number): Promise<void> {
    try {

      const user = this.auth.currentUser;
      const uid = user ? user.uid : null;

      const docRef = await addDoc(collection(this.firestore, 'partidas_poker'), {
        puntaje,
        tiempo,
        fecha: new Date(),
        uid
      });
      console.log('Partida guardada con ID:', docRef.id);
    } catch (e) {
      console.error('Error añadiendo el documento: ', e);
    }
  }
}
