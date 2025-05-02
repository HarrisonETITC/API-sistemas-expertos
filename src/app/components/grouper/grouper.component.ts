import { Component, inject, OnInit } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { CitiesService } from '../../services/cities.service';
import { WeatherInfo } from '../../utils/weatherinfo';
import { defaultCities } from '../../utils/static';
import { from, concatMap, delay, tap, throttleTime, distinctUntilChanged, filter, finalize, Observable, of, switchMap } from 'rxjs';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CityResponseMeteo } from '../../classes/cityresponsemeteo';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { WeatherService } from '../../services/weather.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-grouper',
  imports: [
    CardComponent, FormsModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatIconModule, MatAutocompleteModule, CommonModule
  ],
  templateUrl: './grouper.component.html',
  styleUrl: './grouper.component.css'
})
export class GrouperComponent implements OnInit {
  private readonly service: CitiesService = inject(CitiesService)
  private readonly service2: WeatherService = inject(WeatherService)
  protected weathersOriginal: WeatherInfo[] = [];
  protected weatherFiltered: WeatherInfo[] = [];
  protected searchControl = new FormControl('');
  protected showSeachBar = false;
  protected options$: Observable<CityResponseMeteo[]> = of([]);

  ngOnInit(): void {
    this.init();
    this.initControl();
  }

  init(): void {
    from(defaultCities).pipe(
      delay(50),
      concatMap((cityName: string) => this.service2.getCitiesByQuery(cityName)),
      tap(cities => this.loadCityInfo(cities[0], true)),
      finalize(() => this.showSeachBar = true)
    ).subscribe();
  }

  searchCity(cityName: string) {
    this.service2.getCitiesByQuery(cityName).pipe(
      tap(cities => this.loadCitiesInfo(cities, false))
    ).subscribe();
  }

  loadCitiesInfo(cities: CityResponseMeteo[], firstLoad: boolean): void {
    from(cities).pipe(
      delay(50),
      concatMap((city: CityResponseMeteo) => this.service2.getWeatherInfoByCity(city)),
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

  loadCityInfo(city: CityResponseMeteo, firstLoad: boolean): void {
    this.service2.getWeatherInfoByCity(city).pipe(
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
    // this.searchControl.valueChanges.pipe(
    //   throttleTime(200, undefined, { leading: false, trailing: true }),
    //   filter((query) => {
    //     if (query === '')
    //       this.weatherFiltered = [];

    //     return query !== ''
    //   }),
    //   distinctUntilChanged(),
    //   tap((query) => {
    //     this.weatherFiltered = [];
    //     this.searchCity(query)
    //   })
    // ).subscribe();
    this.options$ = this.searchControl.valueChanges.pipe(
      throttleTime(400, undefined, { leading: false, trailing: true }),
      distinctUntilChanged(),
      switchMap((query) => {
        if (typeof query === 'string' && query.length > 2) {
          return this.service2.getCitiesByQuery(query);
        }

        return of([]);
      })
    )
  }

  resetOriginal(): void {
    this.weatherFiltered = this.weathersOriginal;
    this.searchControl.setValue('', { emitEvent: false });
  }

  displayFn(city: any): string {
    return city && 'name' in city && 'country' in city ? `${city.name} - ${city.country}` : '';
  }

  citySelected(event: MatAutocompleteSelectedEvent): void {
    const city: CityResponseMeteo = event.option.value;
    this.weatherFiltered = [];
    this.loadCityInfo(city, false)
  }
}
