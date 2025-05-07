import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cronometro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cronometro.component.html',
  styleUrls: ['./cronometro.component.css']
})
export class CronometroComponent implements OnInit, OnDestroy {
  segundos: number = 0;
  intervalo!: any;

  @Output() tiempoFinalizado = new EventEmitter<number>();

  ngOnInit(): void {
    this.iniciar();
  }

  iniciar(): void {
    this.intervalo = setInterval(() => {
      this.segundos++;
    }, 1000);
  }

  detener(): void {
    clearInterval(this.intervalo);
    this.tiempoFinalizado.emit(this.segundos);
  }

  reiniciar(): void {
    clearInterval(this.intervalo);
    this.segundos = 0;
    this.iniciar();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalo);
  }
}
