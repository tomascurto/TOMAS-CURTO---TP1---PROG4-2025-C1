import { Component, OnInit, viewChild, ViewChild } from '@angular/core';
import { GeneradorPreguntasService } from '../../services/generador-preguntas.service';
import { Pregunta } from '../../models/pregunta.model';
import { PokeApiService } from '../../services/poke-api.service';
import { forkJoin } from 'rxjs';
import { CronometroComponent } from '../../componentes/cronometro/cronometro.component';
import { CommonModule } from '@angular/common';
import { PartidasQuizService } from '../../services/partidas-quiz.service';


@Component({
  selector: 'app-pokemon-quiz',
  templateUrl: './pokemon-quiz.component.html',
  styleUrls: ['./pokemon-quiz.component.css'],
  standalone: true,
  imports: [CommonModule, CronometroComponent]
})
export class PokemonQuizComponent implements OnInit {
  @ViewChild(CronometroComponent) cronometro!: CronometroComponent;

  listaCompletaPokemones: any[] = [];
  listaCompletaMovimientos: any[] = [];
  listaCompletaHabilidades: any[] = [];
  listaCompletaCadenas: any[] = [];
  juegoEnCurso: boolean = false;
  juegoIniciado: boolean = false;
  juegoFinalizado: boolean = false;

  pregunta: any; 
  respuestaSeleccionada: string = '';
  resultado: string = '';
  puntuacion: number = 0;

  constructor(private pokeApiService: PokeApiService, private generadorPreguntasService: GeneradorPreguntasService, private partidasQuizService: PartidasQuizService) {}

  ngOnInit(): void {
    this.cargarListas();
  }

  cargarListas(): void {
    forkJoin({
      pokemones: this.pokeApiService.getPokemonList(),
      movimientos: this.pokeApiService.getMoveList(),
      habilidades: this.pokeApiService.getAbilityList(),
      cadenas: this.pokeApiService.getEvolutionChains()
    }).subscribe({
      next: (res) => {
        this.listaCompletaPokemones = res.pokemones.results;
        this.listaCompletaMovimientos = res.movimientos.results;
        this.listaCompletaHabilidades = res.habilidades.results;
        this.listaCompletaCadenas = res.cadenas;
      },
      error: (err) => {
        console.error('Error al cargar los datos:', err);
      }
    });
  }

  comenzarJuego(): void {
    this.juegoIniciado = true;
    this.juegoFinalizado = false;
    this.puntuacion = 0;
    this.juegoEnCurso = true;
    this.resultado = '';
    setTimeout(() => {
      this.cronometro.reiniciar();
    });

    this.generarNuevaPregunta();
  }

  generarNuevaPregunta(): void {
    this.generadorPreguntasService.generarPreguntaAleatoria(
      this.listaCompletaPokemones,
      this.listaCompletaMovimientos,
      this.listaCompletaHabilidades,
      this.listaCompletaCadenas
    ).subscribe({
      next: (pregunta) => {
        if (!pregunta) {
          this.pregunta = null;
          this.resultado = 'No se pudo cargar la pregunta.';
          return;
        }

        this.pregunta = pregunta;
        this.respuestaSeleccionada = '';
        this.resultado = '';
        this.cronometro.reanudar();
      },
      error: (err) => {
        console.error('Error al generar la pregunta:', err);
      }
    });
  }

  verificarRespuesta(respuesta: string): void {
    this.respuestaSeleccionada = respuesta;
    this.cronometro.pausar(); 

    if (respuesta === this.pregunta.respuestaCorrecta) {
      this.resultado = '¡Correcto!';
      this.puntuacion++;
    } else {
      this.resultado = `Incorrecto. La respuesta correcta era ${this.pregunta.respuestaCorrecta}`;
      this.juegoFinalizado = true;
      this.juegoEnCurso = false;
      this.cronometro.detener(); 
    }
  }

  reiniciarJuego(): void {
    this.juegoIniciado = false;
    this.juegoFinalizado = false;
    this.juegoEnCurso = false;
    this.respuestaSeleccionada = '';
    this.resultado = '';
    this.puntuacion = 0;
    setTimeout(() => {
      this.cronometro.reiniciar();
    });
    this.generarNuevaPregunta();
  }

  guardarPartida(segundos: number): void {
    if (this.juegoFinalizado) {
      this.partidasQuizService.guardarPartida(this.puntuacion, segundos);
    }
  }
}