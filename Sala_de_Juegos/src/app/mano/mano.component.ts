import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Carta } from '../shared/interfaces/carta.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mano',
  templateUrl: './mano.component.html',
  styleUrls: ['./mano.component.css'],
  imports:[CommonModule]
})
export class ManoComponent {
  @Input() cartas: Carta[] = [];
  @Output() cartasCambiadas: EventEmitter<Carta[]> = new EventEmitter<Carta[]>();

  cartasSeleccionadas: boolean[] = [false, false, false, false, false]; 

  cambiarCartas(): void {
    const nuevasCartas = [...this.cartas]; 
    this.cartas.forEach((carta, index) => {
      if (this.cartasSeleccionadas[index]) {
        nuevasCartas[index] = this.obtenerNuevaCarta(); 
      }
    });
    this.cartasCambiadas.emit(nuevasCartas); 
  }

  obtenerNuevaCarta(): Carta {
    const palos = ['c', 'h', 'd', 's'];
    const numeros = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'];
    const palo = palos[Math.floor(Math.random() * palos.length)];
    const numero = numeros[Math.floor(Math.random() * numeros.length)];
    const nombre = `${numero}${palo}`;
    const valor = parseInt(numero);
    return {
      nombre,
      palo,
      valor,
      imagen: `assets/cartas/${nombre}.png`
    };
  }

  seleccionarCarta(index: number): void {
    this.cartasSeleccionadas[index] = !this.cartasSeleccionadas[index]; 
  }
}
