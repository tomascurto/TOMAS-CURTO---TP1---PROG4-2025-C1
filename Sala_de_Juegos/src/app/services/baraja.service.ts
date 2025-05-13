// src/app/services/baraja.service.ts
import { Injectable } from '@angular/core';
import { Carta } from '../shared/interfaces/carta.interface';

@Injectable({
  providedIn: 'root'
})
export class BarajaService {
  private palos = ['c', 'h', 'd', 's'];
  private numeros = ['2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14'];

  constructor() { }

  generarMazo(): Carta[] {
    const mazo: Carta[] = [];

    for (const palo of this.palos) {
      for (const numero of this.numeros) {
        mazo.push({
          nombre: `${numero}${palo}`,
          palo,
          valor: this.valorCarta(numero),
          imagen: `assets/cartas/${numero}${palo}.png`
        });
      }
    }

    this.barajar(mazo);

    return mazo;
  }

  private barajar(mazo: Carta[]): void {
    let i = mazo.length;
    let j = 0;
    let temp: Carta;

    while (i !== 0) {
      j = Math.floor(Math.random() * i);
      i--;
      temp = mazo[i];
      mazo[i] = mazo[j];
      mazo[j] = temp;
    }
  }

  private valorCarta(carta: string): number {
    return parseInt(carta);
  }
}
