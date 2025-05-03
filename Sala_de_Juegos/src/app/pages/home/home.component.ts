import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, CardModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  games = [
    { name: 'Juego 1', description: 'descripcion juego 1' },
    { name: 'Juego 2', description: 'descripcion juego 2' },
    { name: 'Juego 3', description: 'descripcion juego 3' },
    { name: 'Juego 4', description: 'descripcion juego 4' }
  ];
}
