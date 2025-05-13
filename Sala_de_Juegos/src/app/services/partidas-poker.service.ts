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

  async guardarPartidaExtendida(
  puntaje: number,
  tiempo: number,
  mejorJuego: string,
  mejorManoCartas: any[]
): Promise<void> {
  try {
    const user = this.auth.currentUser;
    const uid = user ? user.uid : null;
    const displayName = user?.displayName ?? 'Anónimo';

    const mejorManoSimplificada = mejorManoCartas.map(c => ({
      nombre: c.nombre,
      palo: c.palo,
      valor: c.valor,
      imagen: c.imagen
    }));

    const docRef = await addDoc(collection(this.firestore, 'partidas_poker'), {
      puntaje,
      tiempo,
      mejorJuego,
      mejorMano: mejorManoSimplificada,
      fecha: new Date(),
      uid,
      displayName
    });
    console.log('Partida guardada con ID:', docRef.id);
  } catch (e) {
    console.error('Error añadiendo el documento', e);
  }
}
}
