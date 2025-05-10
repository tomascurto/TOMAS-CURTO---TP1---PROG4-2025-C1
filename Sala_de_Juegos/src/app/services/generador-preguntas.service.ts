import { Injectable } from '@angular/core';
import { PokeApiService } from './poke-api.service';
import { Pregunta, Opcion } from '../models/pregunta.model';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';
import { filter } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeneradorPreguntasService {
  constructor(private pokeApiService: PokeApiService) {}

    generarPreguntaAleatoria(
    listaPokemones: any[],
    listaMovimientos: any[],
    listaHabilidades: any[],
    listaCadenasEvolucion: any[]  
  ): Observable<Pregunta| null> {
    const tipoPregunta = this.obtenerTipoPreguntaAleatorio();
    
    switch (tipoPregunta) {
    case 'evolucion':
      return this.generarPreguntaEvolucion(listaCadenasEvolucion, listaPokemones);
    case 'preevolucion':
      return this.generarPreguntaEvolucionDesde(listaCadenasEvolucion, listaPokemones);
    case 'generacion':
      return this.generarPreguntaGeneracion(); // No necesita listas externas
    case 'numeroPokedex':
      return this.generarPreguntaPokedexNumero(); // No necesita listas externas
    case 'pokedex':
      return this.generarPreguntaPokedex(listaPokemones);
    case 'nombre':
      return this.generarPreguntaNombre(listaPokemones);
    case 'tipo':
      const tiposDisponibles = [
        'normal', 'fighting', 'flying', 'poison', 'ground', 'rock', 'bug',
        'ghost', 'steel', 'fire', 'water', 'grass', 'electric', 'psychic',
        'ice', 'dragon', 'dark', 'fairy'
      ];
      return this.generarPreguntaTipo(listaPokemones, tiposDisponibles);
    case 'habilidad':
      const habilidades = listaHabilidades.map((h: any) => h.name);
      return this.generarPreguntaHabilidad(listaPokemones, habilidades);
    case 'movimiento':
      const movimientos = listaMovimientos.map((m: any) => m.name);
      return this.generarPreguntaMovimiento(listaPokemones, movimientos);
    default:
      return this.generarPreguntaPokedex(listaPokemones);
  }
}

    private obtenerTipoPreguntaAleatorio(): string {
        const tipos = ['evolucion', 'generacion', 'numeroPokedex', 'pokedex', 'nombre', 'preevolucion', 'tipo', 'habilidad', 'movimiento']; 
        const indiceAleatorio = Math.floor(Math.random() * tipos.length);
        return tipos[indiceAleatorio];
    }

    generarPreguntaNombre(pokemonList: any[]): Observable<Pregunta> {
        const pokemonAleatorio = pokemonList[Math.floor(Math.random() * pokemonList.length)];
        const nombreCorrecto = pokemonAleatorio.name;
        const idPokemon = pokemonAleatorio.url.split('/')[6];

        return this.obtenerOpcionesIncorrectasNombre(nombreCorrecto, pokemonList).pipe(
            map((opcionesIncorrectas) => {
                const opciones = this.mezclarOpciones([nombreCorrecto, ...opcionesIncorrectas]);

                const pregunta: Pregunta = {
                    id: `nombre-${idPokemon}`,
                    pregunta: '¿Quién es ese Pokémon?',
                    imagenUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${idPokemon}.png`,
                    opciones: opciones.map((opcion) => ({
                        texto: opcion,
                        valor: opcion
                    })),
                    respuestaCorrecta: nombreCorrecto
                };

                return pregunta;
            })
        );
    }

    private obtenerOpcionesIncorrectasNombre(correcto: string, lista: any[]): Observable<string[]> {
        const nombresFiltrados = lista
            .map(p => p.name)
            .filter(name => name !== correcto);  

        const seleccionadas: Set<string> = new Set();
        while (seleccionadas.size < 3) {
            const nombre = nombresFiltrados[Math.floor(Math.random() * nombresFiltrados.length)];
            seleccionadas.add(nombre);  
        }
        return of([...seleccionadas]); 
    }

    generarPreguntaTipo(pokemonList: any[], tiposDisponibles: string[]): Observable<Pregunta> {
        const pokemonAleatorio = pokemonList[Math.floor(Math.random() * pokemonList.length)];
        const nombreCorrecto = pokemonAleatorio.name;
        const idPokemon = pokemonAleatorio.url.split('/')[6];

        return this.pokeApiService.getPokemon(nombreCorrecto).pipe(
            switchMap((pokemonDetalles) => {
                const tiposCorrectos = pokemonDetalles.types.map((type: { type: { name: string } }) => type.type.name);

                return this.obtenerOpcionesIncorrectasTipos(tiposCorrectos, tiposDisponibles).pipe(
                    map((tiposIncorrectos) => {
                        const tipoCorrectoAleatorio = this.mezclarOpciones(tiposCorrectos)[0];

                        const opcionesIncorrectas = this.mezclarOpciones(tiposIncorrectos).slice(0, 3);

                        const opciones = this.mezclarOpciones([tipoCorrectoAleatorio, ...opcionesIncorrectas]);

                        const pregunta: Pregunta = {
                            id: `tipo-${idPokemon}`,
                            pregunta: `¿Cuál tipo pertenece a ${nombreCorrecto}?`,
                            imagenUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${idPokemon}.png`,
                            opciones: opciones.map((opcion) => ({
                                texto: opcion,
                                valor: opcion
                            })),
                            respuestaCorrecta: tipoCorrectoAleatorio  
                        };

                        return pregunta;
                    })
                );
            })
        );
    }

    private obtenerOpcionesIncorrectasTipos(tiposCorrectos: string[], tiposDisponibles: string[]): Observable<string[]> {
        const tiposIncorrectos = tiposDisponibles.filter((tipo) => !tiposCorrectos.includes(tipo));

        return of(tiposIncorrectos); 
    }

    generarPreguntaMovimiento(pokemonList: any[], movimientosDisponibles: string[]): Observable<Pregunta> {
        const pokemonAleatorio = pokemonList[Math.floor(Math.random() * pokemonList.length)];
        const nombrePokemon = pokemonAleatorio.name;
        const idPokemon = pokemonAleatorio.url.split('/')[6];

        return this.pokeApiService.getPokemon(nombrePokemon).pipe(
            switchMap((pokemonDetalles) => {
                const movimientosCorrectos = pokemonDetalles.moves.map((m: { move: { name: string } }) => m.move.name);

                return this.obtenerMovimientosIncorrectos(movimientosCorrectos, movimientosDisponibles).pipe(
                    map((movimientosIncorrectos) => {
                        const movimientoIncorrecto = movimientosIncorrectos[Math.floor(Math.random() * movimientosIncorrectos.length)];

                        const movimientosCorrectosAleatorios = this.mezclarOpciones(movimientosCorrectos).slice(0, 3);

                        const opciones = this.mezclarOpciones([movimientoIncorrecto, ...movimientosCorrectosAleatorios]);

                        const pregunta: Pregunta = {
                            id: `movimiento-${idPokemon}`,
                            pregunta: `¿Cuál de estos movimientos NO puede aprender ${nombrePokemon}?`,
                            imagenUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${idPokemon}.png`,
                            opciones: opciones.map((texto) => ({
                                texto,
                                valor: texto === movimientoIncorrecto ? 'incorrecto' : 'correcto'
                            })),
                            respuestaCorrecta: movimientoIncorrecto
                        };

                        return pregunta;
                    })
                );
            })
        );
    }

    private obtenerMovimientosIncorrectos(movimientosCorrectos: string[], movimientosDisponibles: string[]): Observable<string[]> {
        const movimientosIncorrectos = movimientosDisponibles.filter(
            (nombre: string) => !movimientosCorrectos.includes(nombre)
        );

        return of(this.mezclarOpciones(movimientosIncorrectos).slice(0, 10)); 
    }

    generarPreguntaHabilidad(pokemonList: any[], habilidadesDisponibles: string[]): Observable<Pregunta> {
        const pokemon = pokemonList[Math.floor(Math.random() * pokemonList.length)];
        const nombre = pokemon.name;
        const idPokemon = pokemon.url.split('/')[6];

        return this.pokeApiService.getPokemon(nombre).pipe(
            switchMap((detalles) => {
                const habilidadesCorrectas = detalles.abilities.map(
                    (h: { ability: { name: string } }) => h.ability.name
                );

                const habilidadCorrecta = this.mezclarOpciones(habilidadesCorrectas)[0];

                return this.obtenerHabilidadesIncorrectas(habilidadesCorrectas, habilidadesDisponibles).pipe(
                    map((habilidadesIncorrectas) => {
                        const opciones = this.mezclarOpciones([habilidadCorrecta, ...habilidadesIncorrectas]);

                        const pregunta: Pregunta = {
                            id: `habilidad-${idPokemon}`,
                            pregunta: `¿Cuál de estas habilidades pertenece a ${nombre}?`,
                            imagenUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${idPokemon}.png`,
                            opciones: opciones.map((texto) => ({
                                texto,
                                valor: texto === habilidadCorrecta ? 'correcto' : 'incorrecto'
                            })),
                            respuestaCorrecta: habilidadCorrecta
                        };

                        return pregunta;
                    })
                );
            })
        );
    }

    private obtenerHabilidadesIncorrectas(habilidadesCorrectas: string[], habilidadesDisponibles: string[]): Observable<string[]> {
        const habilidadesIncorrectas = habilidadesDisponibles.filter(
            (h: string) => !habilidadesCorrectas.includes(h)
        );
        return of(this.mezclarOpciones(habilidadesIncorrectas).slice(0, 3));
    }

    generarPreguntaEvolucion(listaEvoluciones: any[], listaPokemones: any[]): Observable<Pregunta | null> {
        return of(listaEvoluciones).pipe(
            switchMap((evolutionChains: any[]) => {
                const validChains = evolutionChains.filter((chain) => chain.chain && chain.chain.evolves_to && chain.chain.evolves_to.length > 0);
                
                if (validChains.length === 0) {
                    return of(null);
                }

                const randomChain = this.mezclarOpciones(validChains)[0];

                const pokemonConEvolucion = this.obtenerPokemonConEvolucion(randomChain);

                if (!pokemonConEvolucion) {
                    return of(null); 
                }

                const evolucion = pokemonConEvolucion.evolves_to[0].species.name;

                const opcionesIncorrectas = this.obtenerOpcionesIncorrectasEvolucion(
                    pokemonConEvolucion.species.name, evolucion, listaPokemones
                );

                const opciones = this.mezclarOpciones([evolucion, ...opcionesIncorrectas]);

                const pregunta: Pregunta = {
                    id: `evolucion-${pokemonConEvolucion.species.name}`,
                    pregunta: `¿Cuál es la evolución de ${pokemonConEvolucion.species.name}?`,
                    imagenUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonConEvolucion.species.name}.png`,
                    opciones: opciones.map((texto) => ({
                        texto,
                        valor: texto === evolucion ? 'correcto' : 'incorrecto'
                    })),
                    respuestaCorrecta: evolucion
                };

                return of(pregunta);
            }),
            catchError(() => of(null)) 
        );
    }

    private obtenerPokemonConEvolucion(chain: any): any {
        if (chain.evolves_to.length > 0) {
            return chain;
        }

        for (const evo of chain.evolves_to) {
            const resultado = this.obtenerPokemonConEvolucion(evo);
            if (resultado) return resultado;
        }
        return null; 
    }

    private obtenerOpcionesIncorrectasEvolucion(
        pokemon: string, evolucion: string, listaPokemones: any[]
        ): string[] {
            const opcionesPosibles = listaPokemones.filter((p: any) => {
                return p.name !== pokemon && p.name !== evolucion;
            });

        const opcionesIncorrectas = this.mezclarOpciones(opcionesPosibles).slice(0, 3);
        return opcionesIncorrectas.map((p: any) => p.name);
    }


    generarPreguntaEvolucionDesde(evolutionChains: any[], listaPokemones: any[]): Observable<Pregunta | null> {
        const validChains = evolutionChains.filter((chain) => chain.chain && chain.chain.evolves_to && chain.chain.evolves_to.length > 0);

        if (validChains.length === 0) {
            return of(null); 
        }

        const randomChain = this.mezclarOpciones(validChains)[0];
        const pokemonConEvolucion = this.obtenerPokemonConEvolucion(randomChain);

        if (!pokemonConEvolucion) {
            return of(null);
        }

        const nombreOrigen = pokemonConEvolucion.species.name;
        const nombreEvolucion = pokemonConEvolucion.evolves_to[0].species.name;

        const opcionesIncorrectas = this.obtenerOpcionesIncorrectasEvolucion(
            nombreOrigen, nombreEvolucion, listaPokemones
        );

        const opciones = this.mezclarOpciones([nombreOrigen, ...opcionesIncorrectas]);

        const pregunta: Pregunta = {
            id: `evolucion-desde-${nombreEvolucion}`,
            pregunta: `¿Desde qué Pokémon evoluciona ${nombreEvolucion}?`,
            imagenUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${nombreEvolucion}.png`,
            opciones: opciones.map((texto) => ({
                texto,
                valor: texto === nombreOrigen ? 'correcto' : 'incorrecto'
            })),
            respuestaCorrecta: nombreOrigen
        };

        return of(pregunta);
    }

    generarPreguntaPokedex(listaPokemones: any[]): Observable<Pregunta> {
        const pokemonAleatorio = listaPokemones[Math.floor(Math.random() * listaPokemones.length)];
        const nombreCorrecto = pokemonAleatorio.name;
        const idPokemon = pokemonAleatorio.url.split('/')[6];

        return this.obtenerOpcionesIncorrectasNombre(nombreCorrecto, listaPokemones).pipe(
            map((opcionesIncorrectas) => {
                const opciones = this.mezclarOpciones([nombreCorrecto, ...opcionesIncorrectas]);

                const pregunta: Pregunta = {
                    id: `nombre-${idPokemon}`,
                    pregunta: `¿Quién es el pokémon número ${idPokemon} en la Pokédex?`,
                    imagenUrl: "assets/quienes.png",
                    opciones: opciones.map((opcion) => ({
                        texto: opcion,
                        valor: opcion
                    })),
                    respuestaCorrecta: nombreCorrecto
                };

                return pregunta;
            })
        );
    }

    generarPreguntaPokedexNumero(): Observable<Pregunta> {
        return this.pokeApiService.getPokemonList(1025).pipe( 
            switchMap((data) => {
                const listaPokemones = data.results;
                const pokemonAleatorio = listaPokemones[Math.floor(Math.random() * listaPokemones.length)];
                const nombreCorrecto = pokemonAleatorio.name;
                const idPokemon = pokemonAleatorio.url.split('/')[6];  

                const opcionesIncorrectas = this.obtenerOpcionesIncorrectasPokedex(idPokemon);

                const opciones = this.mezclarOpciones([idPokemon, ...opcionesIncorrectas]);

                const pregunta: Pregunta = {
                    id: `numero-pokedex-${idPokemon}`,
                    pregunta: `¿Cuál es el número de la Pokédex de ${nombreCorrecto}?`,
                    imagenUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${idPokemon}.png`, 
                    opciones: opciones.map((opcion) => ({
                        texto: opcion.toString(),
                        valor: opcion.toString()
                    })),
                    respuestaCorrecta: idPokemon.toString()  
                };

                return of(pregunta);
            }),
            catchError(() => of({
                id: 'error',
                pregunta: 'Hubo un error al cargar la pregunta',
                opciones: [],
                respuestaCorrecta: ''
            }))
        );
    }

    private obtenerOpcionesIncorrectasPokedex(correcto: string): number[] {
        const opcionesIncorrectas: Set<number> = new Set();

        while (opcionesIncorrectas.size < 3) {
            const numeroAleatorio = Math.floor(Math.random() * 1024) + 1; 
            
            if (numeroAleatorio !== parseInt(correcto)) {
                opcionesIncorrectas.add(numeroAleatorio);
            }
        }

        return Array.from(opcionesIncorrectas);
    }

    generarPreguntaGeneracion(): Observable<Pregunta> {
        return this.pokeApiService.getPokemonList(1025).pipe(
            switchMap((data) => {
                const listaPokemones = data.results;
                const pokemonAleatorio = listaPokemones[Math.floor(Math.random() * listaPokemones.length)];
                const nombreCorrecto = pokemonAleatorio.name;
                const idPokemon = pokemonAleatorio.url.split('/')[6];

                return this.pokeApiService.getPokemon(nombreCorrecto).pipe(
                    switchMap((pokemonDetalles) => {
                        return this.pokeApiService.getPokemonSpecies(pokemonDetalles.species.url).pipe(
                            switchMap((especieDetalles) => {
                                const generacionCorrecta = especieDetalles.generation.name; 

                                const opcionesIncorrectas = this.obtenerOpcionesIncorrectasGeneracion(generacionCorrecta);

                                const opciones = this.mezclarOpciones([generacionCorrecta, ...opcionesIncorrectas]);

                                const pregunta: Pregunta = {
                                    id: `generacion-${idPokemon}`,
                                    pregunta: `¿A qué generación pertenece ${this.capitalizarPrimeraLetra(nombreCorrecto)}?`,
                                    imagenUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${idPokemon}.png`,
                                    opciones: opciones.map((opcion) => ({
                                        texto: `Generación ${this.formatearNombreGeneracion(opcion)}`,
                                        valor: opcion
                                    })),
                                    respuestaCorrecta: generacionCorrecta
                                };

                                return of(pregunta);
                            })
                        );
                    })
                );
            }),
            catchError(() => of({
                id: 'error',
                pregunta: 'Hubo un error al cargar la pregunta',
                opciones: [],
                respuestaCorrecta: ''
            }))
        );
    }
    formatearNombreGeneracion(nombre: string): string {
    const mapGeneraciones = {
        'generation-i': '1',
        'generation-ii': '2',
        'generation-iii': '3',
        'generation-iv': '4',
        'generation-v': '5',
        'generation-vi': '6',
        'generation-vii': '7',
        'generation-viii': '8',
        'generation-ix': '9',
    };

    const generacion = mapGeneraciones[nombre as keyof typeof mapGeneraciones];
    
    return generacion || nombre;
}

    obtenerOpcionesIncorrectasGeneracion(generacionCorrecta: string): string[] {
        const todasLasGeneraciones = [
            'generation-i',
            'generation-ii',
            'generation-iii',
            'generation-iv',
            'generation-v',
            'generation-vi',
            'generation-vii',
            'generation-viii',
            'generation-ix'
        ];

        const generacionesDisponibles = todasLasGeneraciones.filter(gen => gen !== generacionCorrecta);
        return this.mezclarOpciones(generacionesDisponibles).slice(0, 3);
    }

    capitalizarPrimeraLetra(texto: string): string {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

    private mezclarOpciones(opciones: string[]): string[] {
        for (let i = opciones.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [opciones[i], opciones[j]] = [opciones[j], opciones[i]];
        }
        return opciones;
    }
}
