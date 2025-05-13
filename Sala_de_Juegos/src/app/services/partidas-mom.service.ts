import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, Timestamp } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class PartidasMomService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  async guardarPartida(aciertos: number, tiempo: number): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) return;
    const displayName = user?.displayName ?? 'Anónimo';
    const partida = {
      uid: user.uid,
      displayName,
      aciertos,
      tiempo,
      fecha: new Date(),
    };

    const partidasRef = collection(this.firestore, 'partidasMoM');
    await addDoc(partidasRef, partida);
    console.log('Partida guardada en Firebase:', partida);
  }
}
