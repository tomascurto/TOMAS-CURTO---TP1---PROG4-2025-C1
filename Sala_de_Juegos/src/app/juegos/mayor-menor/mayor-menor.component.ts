import { Component } from '@angular/core';
import { Carta } from '../../shared/interfaces/carta.interface';
import { CommonModule } from '@angular/common';
import { CronometroComponent } from '../../componentes/cronometro/cronometro.component';
import { ViewChild } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { inject } from '@angular/core';
import { PartidasMomService } from '../../services/partidas-mom.service';



@Component({
  selector: 'app-mayor-menor',
  imports:[CommonModule, CronometroComponent],
  templateUrl: './mayor-menor.component.html',
  styleUrls: ['./mayor-menor.component.css']
})

export class MayorMenorComponent {
  constructor(private partidasMomService: PartidasMomService) {}
  firestore = inject(Firestore);
  auth = inject(Auth);
  @ViewChild('cronometro') cronometroComponent!: CronometroComponent;
  baraja: Carta[] = [];
  currentIndex = 0;
  bloqueado = false;
  gameStarted = false;
  aciertos = 0;
  startTime!: number;
  endTime!: number;
  juegoTerminado = false;
  previousCard?: Carta;
  currentCard?: Carta;
  nextCard?: Carta;
  showNextCard = false;
  tiempoFinal!: number;
  cardAnimationState = {
    anterior: '',
    actual: '',
    siguiente: ''
  };

  
  generarYMezclarBaraja(): Carta[] {
    const palos = ['c', 'h', 'd', 's'];
    const numeros = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'];
    const cartas: Carta[] = [];

    for (const palo of palos) {
      for (const numero of numeros) {
        const nombre = `${numero}${palo}`;
        const valor = parseInt(numero);
        cartas.push({
          nombre,
          palo,
          valor,
          imagen: `assets/cartas/${nombre}.png`
        });
      }
    }

    for (let i = cartas.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cartas[i], cartas[j]] = [cartas[j], cartas[i]];
    }

    return cartas;
  }

  startGame(): void {
    this.cardAnimationState = {
      anterior: '',
      actual: '',
      siguiente: ''
    };
    this.bloqueado = false;
    this.showNextCard = false;
    this.gameStarted = true;
    this.juegoTerminado = false;
    this.aciertos = 0;
  
    this.baraja = this.generarYMezclarBaraja();
    this.currentIndex = 0;
  
    this.previousCard = undefined;
    this.currentCard = this.baraja[this.currentIndex];
    this.nextCard = this.baraja[this.currentIndex + 1];
    setTimeout(() => {
      this.cronometroComponent.reiniciar();
    });
  }
  

  finalizarJuego() {
    this.juegoTerminado = true;
    this.gameStarted = false;
  
    this.cronometroComponent.detener();
  }

  guardarTiempo(segundos: number): void {
    this.tiempoFinal = segundos;
    this.partidasMomService.guardarPartida(this.aciertos, this.tiempoFinal);
  }

  moverCartas() {
    this.cardAnimationState = {
      anterior: 'carta-salida',
      actual: '',
      siguiente: 'carta-entrada'
    };
  
    setTimeout(() => {
      this.currentIndex++;
  
      this.previousCard = this.currentCard;
      this.currentCard = this.nextCard;
      this.nextCard = this.baraja[this.currentIndex + 1];
      this.showNextCard = false;
  
      if (this.currentIndex + 1 >= this.baraja.length) {
        const ultima = this.currentCard!;
        const nuevasCartas = this.generarYMezclarBaraja().filter(c => c.nombre !== ultima.nombre);
        this.baraja = [ultima, ...nuevasCartas];
        this.currentIndex = 0;
        this.previousCard = undefined;
        this.currentCard = this.baraja[0];
        this.nextCard = this.baraja[1];
      }
    }, 700);
  }
  

  guess(tipo: 'mayor' | 'menor' | 'igual') {
    if (!this.currentCard || !this.nextCard || this.bloqueado) return;
  
    this.showNextCard = true;
    this.bloqueado = true;

    const valorActual = this.currentCard.valor;
    const valorSiguiente = this.nextCard.valor;
  
    let acierto = false;

    if (tipo === 'mayor') {
      acierto = valorSiguiente > valorActual;
    } else if (tipo === 'menor') {
      acierto = valorSiguiente < valorActual;
    } else if (tipo === 'igual') {
      acierto = valorSiguiente === valorActual;
    }
  
    if (acierto) {
      this.aciertos++;

      this.cardAnimationState = {
        anterior: 'carta-salida',
        actual: '',
        siguiente: 'carta-entrada'
      };

      setTimeout(() => {
        this.moverCartas();
        this.bloqueado = false;
      }, 700); 
    } else {
      this.showNextCard = true;
      this.bloqueado = true;

      setTimeout(() => {
        this.finalizarJuego();
      }, 1000);
    }
  }

}