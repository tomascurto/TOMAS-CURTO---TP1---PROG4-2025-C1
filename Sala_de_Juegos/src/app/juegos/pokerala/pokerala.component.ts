import { Component, OnInit, ViewChild } from '@angular/core';
import { BarajaService } from '../../services/baraja.service';
import { Carta } from '../../shared/interfaces/carta.interface';
import { calcularPuntaje } from '../../services/calcular-puntaje';
import { PartidasPokerService } from '../../services/partidas-poker.service';
import { CronometroComponent } from '../../componentes/cronometro/cronometro.component';
import { CommonModule } from '@angular/common';
import { ManoComponent } from '../../mano/mano.component';

@Component({
  selector: 'app-pokerala',
  templateUrl: './pokerala.component.html',
  styleUrls: ['./pokerala.component.css'],
  imports: [CommonModule, CronometroComponent]
})
export class PokeralaComponent implements OnInit {
  manos = Array(5).fill(null).map(() => ({
    baraja: [] as Carta[],
    manoJugador: [] as Carta[],
    cartasSeleccionadas: [] as Carta[], 
    cartasDescartadas: [] as Carta[],
    juegoTerminado: false,
    puntaje: 0,
    tiempo: 0,
    cambiosDisponibles: 2,
    juego: ""
  }));
  mejorPuntaje: number = 0;
  mejorManoCartas: Carta[] = [];
  mejorJuego: string = "";

  juegoIniciado: boolean = false;
  juegoFinalizado: boolean = false;
  puntajeTotal: number = 0;
  manoActual: number = 0;
  tiempoTotal: number = 0;

  @ViewChild(CronometroComponent) cronometroComponent!: CronometroComponent;

  constructor(
    private barajaService: BarajaService,
    private partidasService: PartidasPokerService,
  ) {}

  ngOnInit(): void {}

  iniciarJuego(): void {
    this.puntajeTotal = 0;
    this.tiempoTotal = 0;
    this.manos.forEach(mano => {
      mano.baraja = this.barajaService.generarMazo();
      mano.manoJugador = mano.baraja.splice(0, 5); // Inicializamos la mano
      mano.cartasDescartadas = [];
      mano.cartasSeleccionadas = [];
      mano.juegoTerminado = false;
      mano.puntaje = 0;
      mano.cambiosDisponibles = 2;
      mano.juego = "";
    });
    this.juegoIniciado = true;
    this.juegoFinalizado = false;
    
  }

  reiniciarJuego(): void {
  this.juegoIniciado = false;
  this.juegoFinalizado = false;
  this.puntajeTotal = 0;
  this.tiempoTotal = 0;
  this.manoActual = 0;

  // Resetear cada mano
  this.manos = Array(5).fill(null).map(() => ({
    baraja: [],
    manoJugador: [],
    cartasSeleccionadas: [],
    cartasDescartadas: [],
    juegoTerminado: false,
    puntaje: 0,
    tiempo: 0,
    cambiosDisponibles: 2,
    juego: ""
  }));
}

  cambiarCartas(manoIndex: number): void {
    const mano = this.manos[manoIndex];
    if (mano.cambiosDisponibles <= 0 || mano.juegoTerminado) return;

    mano.cartasSeleccionadas.forEach(c => mano.cartasDescartadas.push(c));

    const nuevasCartas: Carta[] = [];
    const cartasDisponibles = mano.baraja.filter(c => !mano.manoJugador.includes(c));
    
    for (let i = 0; i < mano.cartasSeleccionadas.length; i++) {
      const nuevaCarta = cartasDisponibles.splice(Math.floor(Math.random() * cartasDisponibles.length), 1)[0];
      nuevasCartas.push(nuevaCarta);
    }

    mano.manoJugador = mano.manoJugador.map(carta =>
      mano.cartasSeleccionadas.includes(carta) ? nuevasCartas.shift()! : carta
    );

    mano.cartasSeleccionadas = [];
    mano.cambiosDisponibles--;

    if (mano.cambiosDisponibles === 0) {
      this.finalizarMano(manoIndex);
    }
  }

  finalizarMano(manoIndex: number): void {
  const mano = this.manos[manoIndex];

  if (mano.juegoTerminado) return; // Evita duplicación

  // Asegura que el tiempo esté actualizado
  if (mano.tiempo === 0 && this.cronometroComponent) {
    mano.tiempo = this.cronometroComponent.segundos;
  }

  mano.puntaje = calcularPuntaje(mano.manoJugador);
  mano.juegoTerminado = true;
  mano.juego = this.obtenerDescripcionJugada(mano.puntaje);

  this.puntajeTotal += mano.puntaje;
  this.tiempoTotal += mano.tiempo;
  if (mano.puntaje > this.mejorPuntaje) {
    this.mejorPuntaje = mano.puntaje;
    this.mejorManoCartas = [...mano.manoJugador]; 
    this.mejorJuego = mano.juego;
}
  if (this.manoActual < 4) {
    this.manoActual++;
  } else {
    this.juegoFinalizado = true;
    this.calcularResultadoFinal();
  }
}

  obtenerDescripcionJugada(puntaje: number): string {
  if (puntaje === 2000000) return 'Escalera Real';
  if (puntaje >= 1200000) return 'Escalera de Color';
  if (puntaje >= 1000000) return 'Poker';
  if (puntaje >= 800000) return 'Full House';
  if (puntaje >= 600000) return 'Color';
  if (puntaje >= 500000) return 'Escalera';
  if (puntaje >= 400000) return 'Trío';
  if (puntaje >= 300000) return 'Doble Par';
  if (puntaje >= 200000) return 'Par';
  return 'Carta Alta';
}

  calcularResultadoFinal(): void {
    const totalPuntaje = this.manos.reduce((sum, m) => sum + m.puntaje, 0);
    const totalTiempo = this.manos.reduce((sum, m) => sum + m.tiempo, 0);
    console.log('Puntaje total:', totalPuntaje, 'Tiempo total:', totalTiempo);
  }

  toggleCartaSeleccionada(carta: Carta, manoIndex: number): void {
    const mano = this.manos[manoIndex];
    const index = mano.cartasSeleccionadas.indexOf(carta);
    if (index > -1) {
      mano.cartasSeleccionadas.splice(index, 1);
    } else {
      mano.cartasSeleccionadas.push(carta);
    }
  }

  // Función para recibir el tiempo de cada cronómetro
  actualizarTiempo({ index, tiempo }: { index: number, tiempo: number }): void {
    const mano = this.manos[index];
    mano.tiempo = tiempo;
    if (mano.juegoTerminado) {
      this.finalizarMano(index);
    }
  }

  guardarPartida(): void {
    this.partidasService.guardarPartidaExtendida(
      this.puntajeTotal,
      this.tiempoTotal,
      this.mejorJuego,
      this.mejorManoCartas
    ).then(() => {
      console.log('Partida guardada con mejor mano.');
    }).catch((error) => {
      console.error('Error al guardar la partida: ', error);
    });
  }

}
