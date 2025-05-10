export interface Pregunta {
  id: string;
  pregunta: string; 
  imagenUrl?: string; 
  opciones: Opcion[]; 
  respuestaCorrecta: string; 
  explicacion?: string;
  metadata?: any; 
}

export interface Opcion {
  texto: string; 
  valor: string; 
}
