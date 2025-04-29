import { Component, Input } from '@angular/core';
import { WeatherInfo } from '../../utils/weatherinfo';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-card',
  imports: [CommonModule, MatIconModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @Input() weatherInfo: WeatherInfo;

  constructor() { }
}
