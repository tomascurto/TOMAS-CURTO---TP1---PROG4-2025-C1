import { Carta } from "../shared/interfaces/carta.interface";

export function calcularPuntaje(cartas: Carta[]): number {
  let valores = cartas.map(c => c.valor).sort((a, b) => a - b);
  const esColor = esColorFunc(cartas);
  const esEscalera = esEscaleraFunc(valores);
  const counts = contarValores(valores);

  const unicos = Array.from(new Set(valores)).sort((a, b) => a - b);
  const sumaConPesos = (vals: number[]) =>
    vals[0] * 1 + vals[1] * 10 + vals[2] * 100 + vals[3] * 1000 + vals[4] * 10000;

  let puntaje = 0;

  if (esEscalera && esColor) {
    if (valores.includes(13) && valores.includes(14)) {
      puntaje = 2000000;
    } else {
      puntaje = 1200000 + valores.reduce((a, b) => a + b) * 1000;
    }
  } else if (esPoker(counts)) {
    const [cuadruple, kicker] = obtenerPoker(counts);
    puntaje = 1000000 + cuadruple * 10000 + kicker * 1000;
  } else if (esFullHouse(counts)) {
    const [trio, par] = obtenerFullHouse(counts);
    puntaje = 800000 + par * 1000 + trio * 10000;
  } else if (esColor) {
    puntaje = 600000 + sumaConPesos(valores);
  } else if (esEscalera) {
    puntaje = 500000 + valores.reduce((a, b) => a + b) * 1000;
  } else if (esTrio(counts)) {
    const [trio, restos] = obtenerTrio(counts);
    puntaje = 400000 + restos[0] * 10 + restos[1] * 100 + trio * 1000;
  } else if (esDoblePar(counts)) {
    const [pares, kicker] = obtenerDoblePar(counts);
    puntaje = 300000 + kicker * 10 + pares[0] * 100 + pares[1] * 1000;
  } else if (esPar(counts)) {
    const [par, restos] = obtenerPar(counts);
    puntaje = 200000 + restos[0] + restos[1] * 10 + restos[2] * 100 + par * 1000;
  } else {
    puntaje = sumaConPesos(valores);
  }

  return puntaje;
}


function contarValores(valores: number[]): Map<number, number> {
  const map = new Map<number, number>();
  valores.forEach(v => map.set(v, (map.get(v) || 0) + 1));
  return map;
}

function esEscaleraFunc(valores: number[]): boolean {
  if (valores.includes(14) && valores.includes(2)) {
    valores = valores.map(v => v === 14 ? 1 : v).sort((a, b) => a - b);
  }
  for (let i = 0; i < valores.length - 1; i++) {
    if (valores[i + 1] !== valores[i] + 1) return false;
  }
  return true;
}

function esColorFunc(cartas: Carta[]): boolean {
  return cartas.every(c => c.palo === cartas[0].palo);
}

function esFullHouse(counts: Map<number, number>): boolean {
  return Array.from(counts.values()).sort().join(',') === '2,3';
}

function obtenerFullHouse(counts: Map<number, number>): [number, number] {
  let trio = 0, par = 0;
  counts.forEach((count, val) => {
    if (count === 3) trio = val;
    if (count === 2) par = val;
  });
  return [trio, par];
}

function esPoker(counts: Map<number, number>): boolean {
  return Array.from(counts.values()).includes(4);
}

function obtenerPoker(counts: Map<number, number>): [number, number] {
  let quad = 0, kicker = 0;
  counts.forEach((count, val) => {
    if (count === 4) quad = val;
    if (count === 1) kicker = val;
  });
  return [quad, kicker];
}

function esTrio(counts: Map<number, number>): boolean {
  return Array.from(counts.values()).includes(3) && counts.size === 3;
}

function obtenerTrio(counts: Map<number, number>): [number, number[]] {
  let trio = 0;
  const restos: number[] = [];
  counts.forEach((count, val) => {
    if (count === 3) trio = val;
    else restos.push(val);
  });
  return [trio, restos.sort((a, b) => a - b)];
}

function esDoblePar(counts: Map<number, number>): boolean {
  return Array.from(counts.values()).filter(c => c === 2).length === 2;
}

function obtenerDoblePar(counts: Map<number, number>): [number[], number] {
  const pares: number[] = [];
  let kicker = 0;
  counts.forEach((count, val) => {
    if (count === 2) pares.push(val);
    if (count === 1) kicker = val;
  });
  return [pares.sort((a, b) => a - b), kicker];
}

function esPar(counts: Map<number, number>): boolean {
  return Array.from(counts.values()).filter(c => c === 2).length === 1;
}

function obtenerPar(counts: Map<number, number>): [number, number[]] {
  let par = 0;
  const restos: number[] = [];
  counts.forEach((count, val) => {
    if (count === 2) par = val;
    else restos.push(val);
  });
  return [par, restos.sort((a, b) => a - b)];
}
