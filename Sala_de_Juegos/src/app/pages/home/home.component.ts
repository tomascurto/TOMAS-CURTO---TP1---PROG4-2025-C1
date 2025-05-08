import { Component, ViewEncapsulation  } from '@angular/core';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, CardModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent {
  games = [
    { 
      name: 'Ahorcado', 
      description: 'Descubre la palabra escondida arriesgandote letra a letra', 
      route: '/juegos/ahorcado', 
      image: 'assets/ahorcado/a6.png' 
    },
    { 
      name: 'Mayor o Menor', 
      description: 'Adivina si la próxima carta es mayor, menor o igual a la anterior', 
      route: '/juegos/mayor-menor', 
      image: 'assets/cartas/MoM.png' 
    },
    // { name: 'Juego 3', description: 'descripcion juego 3' },
    // { name: 'Juego 4', description: 'descripcion juego 4' }
  ];
}
