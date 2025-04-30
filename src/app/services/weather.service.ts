import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable, map, defaultIfEmpty, of } from "rxjs";
import { CityResponseMeteo } from "../classes/cityresponsemeteo";
import { WeatherResponse } from "../utils/weatherresponse";
import { weatherCodeDescriptions, getWeatherIcon } from "../utils/static";
import { WeatherInfo } from "../utils/weatherinfo";

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly citiesUrl: string = 'https://geocoding-api.open-meteo.com/v1/search?name=';
  private readonly weatherUrl: string = 'https://api.open-meteo.com/v1/forecast';
  private readonly weatherComplements: string = '&current=temperature_2m,precipitation,relative_humidity_2m,is_day,apparent_temperature,wind_speed_10m,weather_code&timezone=auto';

  constructor() { }

  getCitiesByQuery(query: string): Observable<CityResponseMeteo[]> {
    return this.http.get<{ results: CityResponseMeteo[] }>(`${this.citiesUrl}${encodeURIComponent(query).replaceAll('%20', '+')}`).pipe(
      map((places) => places.results),
      defaultIfEmpty([])
    );
  }

  getWeatherByCity(city: CityResponseMeteo): Observable<WeatherResponse> {
    return this.http.get<WeatherResponse>(`${this.weatherUrl}?latitude=${city.latitude}&longitude=${city.longitude}${this.weatherComplements}`)
  }

  getWeatherInfoByCity(city: CityResponseMeteo): Observable<WeatherInfo> {
    if (!(city?.latitude && city?.longitude)) {
      return of(null)
    }

    return this.http.get<WeatherResponse>(`${this.weatherUrl}?latitude=${city.latitude}&longitude=${city.longitude}${this.weatherComplements}`).pipe(
      map((weather: WeatherResponse) => ({
        weatherName: weatherCodeDescriptions[weather.current.weather_code],
        wind: `${weather.current.wind_speed_10m}`,
        humidity: `${weather.current.relative_humidity_2m}`,
        cityName: city.name,
        temperature: `${weather.current.temperature_2m}`,
        country: city.country,
        elevation: city.elevation,
        timezone: weather.timezone_abbreviation,
        hour: new Date(weather.current.time).toLocaleTimeString('en-GB', { hour: "2-digit", minute: "2-digit" }),
        icon: getWeatherIcon(weather.current.weather_code, weather.current.is_day)
      }))
    )
  }

}

