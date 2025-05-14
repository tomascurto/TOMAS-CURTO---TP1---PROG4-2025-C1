import { Component, OnInit } from '@angular/core';
import { RankingService } from '../../services/ranking.service';
import { CommonModule } from '@angular/common';
import { TabViewModule } from 'primeng/tabview';

@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.css'],
  imports:[CommonModule, TabViewModule],
})
export class ResultadosComponent implements OnInit {
  tabs = ['Ahorcado', 'Mayor o Menor', 'Pokémon', 'Pokerala'];
  selectedTab = 0;

  rankingAhorcado = <any>[];
  rankingMoM = <any>[];
  rankingPokemon = <any>[];
  rankingPoker = <any>[];

  constructor(private rankingService: RankingService) {}

  ngOnInit(): void {
    this.getRankings();
  }

  getRankings() {
    this.rankingService.getAhorcadoRanking().subscribe((data) => {
      this.rankingAhorcado = data;
    });
    this.rankingService.getMoMRanking().subscribe((data) => {
      this.rankingMoM = data;
    });
    this.rankingService.getPokemonQuizRanking().subscribe((data) => {
      this.rankingPokemon = data;
    });
    this.rankingService.getPokerRanking().subscribe((data) => {
      this.rankingPoker = data;
    });
  }
}
