import { Component, inject, OnInit } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { CitiesService } from '../../services/cities.service';
import { WeatherInfo } from '../../utils/weatherinfo';
import { defaultCities } from '../../utils/static';
import { from, concatMap, delay, tap, throttleTime, distinctUntilChanged, filter, finalize } from 'rxjs';
import { CityResponse } from '../../utils/cityinfo';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-grouper',
  imports: [
    CardComponent, FormsModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatIconModule
  ],
  templateUrl: './grouper.component.html',
  styleUrl: './grouper.component.css'
})
export class GrouperComponent implements OnInit {
  private readonly service: CitiesService = inject(CitiesService)
  protected weathersOriginal: WeatherInfo[] = [];
  protected weatherFiltered: WeatherInfo[] = [];
  protected searchControl = new FormControl('');
  protected showSeachBar = false;

  ngOnInit(): void {
    this.init();
    this.initControl();
  }

  init(): void {
    from(defaultCities).pipe(
      delay(50),
      concatMap((cityName: string) => this.service.getCitiesByQuery(cityName)),
      tap(cities => this.loadCitiesInfo(cities, true)),
      finalize(() => this.showSeachBar = true)
    ).subscribe();
  }

  searchCity(cityName: string) {
    this.service.getCitiesByQuery(cityName).pipe(
      tap(cities => this.loadCitiesInfo(cities, false))
    ).subscribe();
  }

  loadCitiesInfo(cities: CityResponse[], firstLoad: boolean): void {
    from(cities).pipe(
      delay(50),
      concatMap((city: CityResponse) => this.service.getWeatherInfoByCity(city)),
      tap((weather: WeatherInfo) => {
        this.searchControl.disable({ emitEvent: false });
        this.weatherFiltered.push(weather);
        if (firstLoad) {
          this.weathersOriginal.push(weather);
        }
      }),
      finalize(() => this.searchControl.enable({ emitEvent: false }))
    ).subscribe();
  }

  initControl(): void {
    this.searchControl.valueChanges.pipe(
      throttleTime(200, undefined, { leading: false, trailing: true }),
      filter((query) => {
        if (query === '')
          this.weatherFiltered = [];

        return query !== ''
      }),
      distinctUntilChanged(),
      tap((query) => {
        this.weatherFiltered = [];
        this.searchCity(query)
      })
    ).subscribe();
  }

  resetOriginal(): void {
    this.weatherFiltered = this.weathersOriginal;
    this.searchControl.setValue('', { emitEvent: false });
  }
}
