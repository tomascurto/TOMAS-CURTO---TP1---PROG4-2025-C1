import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RaeService } from '../../services/rae.service';

@Component({
  selector: 'app-ahorcado',
  templateUrl: './ahorcado.component.html',
  imports: [CommonModule],
  styleUrls: ['./ahorcado.component.css']
})
export class AhorcadoComponent implements OnInit {
  constructor(private raeService: RaeService) {} 
  palabraOculta: string = '';
  letrasSeleccionadas: string[] = [];
  letrasCorrectas: string[] = [];
  errores: number = 0;
  maxErrores: number = 6;
  abecedario: string[][] = [];
  juegoTerminado: boolean = false;
  gano: boolean = false;

  ngOnInit(): void {
    this.dividirAbecedario();
    this.reiniciarJuego();
  }

  dividirAbecedario() {
    const letras = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
    this.abecedario = [
      letras.slice(0, 9),    // fila 1
      letras.slice(9, 18),   // fila 2
      letras.slice(18)       // fila 3
    ];
  }

  reiniciarJuego() {
    this.errores = 0;
    this.juegoTerminado = false;
    this.gano = false;
    this.letrasSeleccionadas = [];
    this.letrasCorrectas = [];
    this.obtenerPalabra(); 
  }

  obtenerPalabra() {
    this.raeService.getRandomWord().subscribe(palabra => {
      this.palabraOculta = palabra.toUpperCase();
    });
  }

  seleccionarLetra(letra: string) {
    if (this.juegoTerminado || this.letrasSeleccionadas.includes(letra)) return;

    this.letrasSeleccionadas.push(letra);

    if (this.palabraOculta.includes(letra)) {
      this.letrasCorrectas.push(letra);
      this.verificarVictoria();
    } else {
      this.errores++;
      if (this.errores >= this.maxErrores) {
        this.juegoTerminado = true;
      }
    }
  }

  verificarVictoria() {
    const todasAdivinadas = this.palabraOculta
      .split('')
      .every(letra => this.letrasCorrectas.includes(letra));

    if (todasAdivinadas) {
      this.juegoTerminado = true;
      this.gano = true;
    }
  }
}
