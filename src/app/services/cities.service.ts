import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { defaultIfEmpty, map, Observable, of } from 'rxjs';
import { CityResponse } from '../utils/cityinfo';
import { WeatherInfo } from '../utils/weatherinfo';
import { WeatherResponse } from '../utils/weatherresponse';
import { getWeatherIcon, weatherCodeDescriptions } from '../utils/static';

@Injectable({
  providedIn: 'root'
})
export class CitiesService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly citiesUrl: string = 'https://nominatim.openstreetmap.org/search?format=json&q';
  private readonly weatherUrl: string = 'https://api.open-meteo.com/v1/forecast';
  private readonly weatherComplements: string = '&current=temperature_2m,precipitation,relative_humidity_2m,is_day,apparent_temperature,wind_speed_10m,weather_code';

  constructor() { }

  getCitiesByQuery(query: string): Observable<CityResponse[]> {
    return this.http.get<CityResponse[]>(`${this.citiesUrl}=${encodeURIComponent(query)}`).pipe(
      map((places) => {
        const duplicates = new Set<string>();
        return places.filter((place) => {
          const isCity = place.addresstype === 'city';
          const isDuplicate = duplicates.has(place.name);
          if (isCity && !isDuplicate) {
            duplicates.add(place.name);
            return true;
          }
          return false;
        });
      }),
      defaultIfEmpty([])// Manejo de errores: devuelve un array vacío en caso de error
    );
  }

  getWeatherByCity(city: CityResponse): Observable<WeatherResponse> {
    return this.http.get<WeatherResponse>(`${this.weatherUrl}?latitude=${city.lat}&longitude=${city.lon}${this.weatherComplements}`)
  }

  getWeatherInfoByCity(city: CityResponse): Observable<WeatherInfo> {
    if (!(city?.lat && city?.lon)) {
      return of(null)
    }

    return this.http.get<WeatherResponse>(`${this.weatherUrl}?latitude=${city.lat}&longitude=${city.lon}${this.weatherComplements}`).pipe(
      map((weather: WeatherResponse) => ({
        weatherName: weatherCodeDescriptions[weather.current.weather_code],
        wind: `${weather.current.wind_speed_10m}`,
        humidity: `${weather.current.relative_humidity_2m}`,
        cityName: city.name,
        temperature: `${weather.current.temperature_2m}`,
        icon: getWeatherIcon(weather.current.weather_code, weather.current.is_day)
      }))
    )
  }
}
