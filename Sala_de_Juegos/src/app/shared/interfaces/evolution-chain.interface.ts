interface EvolutionChain {
  species: { name: string };
  evolves_to: EvolutionChain[];
}
