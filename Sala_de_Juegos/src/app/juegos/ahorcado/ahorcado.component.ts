import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RaeService } from '../../services/rae.service';
import { PartidasAhorcadoService } from '../../services/partidasahorcado.service';
import { CronometroComponent } from '../../componentes/cronometro/cronometro.component';
import { ViewChild } from '@angular/core';


@Component({
  selector: 'app-ahorcado',
  templateUrl: './ahorcado.component.html',
  imports: [CommonModule, CronometroComponent],
  styleUrls: ['./ahorcado.component.css']
})
export class AhorcadoComponent implements OnInit {
  constructor(private raeService: RaeService,
    private partidasAhorcadoService: PartidasAhorcadoService) {} 
  @ViewChild(CronometroComponent) cronometroComponent!: CronometroComponent;
  palabraOculta: string = '';
  letrasSeleccionadas: string[] = [];
  letrasCorrectas: string[] = [];
  errores: number = 0;
  maxErrores: number = 6;
  abecedario: string[][] = [];
  juegoTerminado: boolean = false;
  gano: boolean = false;
  juegoIniciado: boolean = false;
  tiempoJugado: number = 0;

  ngOnInit(): void {
    this.dividirAbecedario();
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
    this.juegoIniciado = true;
    this.obtenerPalabra(); 
    if (this.cronometroComponent) {
      this.cronometroComponent.reiniciar();
    }
  }

  obtenerPalabra() {
    this.raeService.getRandomWord().subscribe(palabra => {
      if (this.esPalabra(palabra)) {
        const palabraNormalizada = palabra.toUpperCase().split('').map(letra => {
          
              if (letra !== 'Ñ' && letra !== 'ñ') {
                return letra.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
              }
              return letra;
            }).join(''); 
        
            this.palabraOculta = palabraNormalizada;
      } else {
        this.obtenerPalabra();
      }
    });
  }

  esPalabra(palabra: string): boolean {
    const regex = /^[A-ZÁÉÍÓÚÜÑ]+$/i;
    return regex.test(palabra);
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
        this.cronometroComponent.detener();
        this.guardarTiempo(this.cronometroComponent.segundos),
        this.guardarResultado(false);
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
      this.cronometroComponent.detener();
      this.guardarTiempo(this.cronometroComponent.segundos),
      this.guardarResultado(true);
    }
  }

  guardarResultado(gano: boolean) {
    this.partidasAhorcadoService.guardarPartida({
      palabra: this.palabraOculta,
      letrasSeleccionadas: this.letrasSeleccionadas.length,
      vidasRestantes: this.maxErrores - this.errores,
      resultado: gano,
      duracionSegundos: this.tiempoJugado
    });
  }

  guardarTiempo(segundos: number) {
    this.tiempoJugado = segundos;
  }
}
