import { Component, OnInit } from '@angular/core';
import { GeneradorPreguntasService } from '../../services/generador-preguntas.service';
import { Pregunta } from '../../models/pregunta.model';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PokeApiService } from '../../services/poke-api.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-pokemon-quiz',
  templateUrl: './pokemon-quiz.component.html',
  imports:[CommonModule],
  styleUrls: ['./pokemon-quiz.component.css']
})
export class PokemonQuizComponent implements OnInit {
  listaCompletaPokemones: any[] = [];
  listaCompletaMovimientos: any[] = [];
  listaCompletaHabilidades: any[] = [];
  listaCompletaCadenas: any[] = [];
  pregunta: any; 
  respuestaSeleccionada: string = '';
  resultado: string = '';
  puntuacion: number = 0;

  constructor(private pokeApiService: PokeApiService, private generadorPreguntasService: GeneradorPreguntasService) {}

  ngOnInit(): void {
    this.cargarListas();
    this.generarNuevaPregunta();
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
        this.generarNuevaPregunta();
      },
      error: (err) => {
        console.error('Error al cargar los datos:', err);
      }
    });
  }                                     


  generarNuevaPregunta(): void {
    this.generadorPreguntasService.generarPreguntaAleatoria(
      this.listaCompletaPokemones,
      this.listaCompletaMovimientos,
      this.listaCompletaHabilidades,
      this.listaCompletaCadenas  
    ).subscribe({
      next: (pregunta) => {
        this.pregunta = pregunta;
        this.respuestaSeleccionada = '';
        this.resultado = ''; 
      },
      error: (err) => {
        console.error('Error al cargar la pregunta:', err);
      }
    });
  }

  verificarRespuesta(respuesta: string): void {
    this.respuestaSeleccionada = respuesta;

    if (respuesta === this.pregunta.respuestaCorrecta) {
      this.resultado = '¡Correcto!';
      this.puntuacion++;
    } else {
      this.resultado = `Incorrecto. La respuesta correcta era ${this.pregunta.respuestaCorrecta}`;
    }
  }
}
