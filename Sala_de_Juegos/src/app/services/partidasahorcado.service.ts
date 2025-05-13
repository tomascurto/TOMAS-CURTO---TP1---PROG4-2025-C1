import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { getAuth } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class PartidasAhorcadoService {
  constructor(private firestore: Firestore) {}

  async guardarPartida(partida: any) {
    const user = getAuth().currentUser;
    if (!user) return;
    const displayName = user?.displayName ?? 'Anónimo';
    const partidasRef = collection(this.firestore, 'partidasAhorcado');
    const datos = {
      displayName,
      uid: user.uid,
      fecha: new Date(),
      ...partida
    };
    return await addDoc(partidasRef, datos);
  }
}
