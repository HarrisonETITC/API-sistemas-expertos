import { Observable } from "rxjs";
import { CityResponse } from "./cityinfo";
import { WeatherInfo } from "./weatherinfo";
import { WeatherResponse } from "./weatherresponse";

export interface WeatherServiceInterface {
    getCitiesByQuery(query: string): Observable<CityResponse[]>;
    getWeatherByCity(city: CityResponse): Observable<WeatherResponse>;
    getWeatherInfoByCity(city: CityResponse): Observable<WeatherInfo>;
    getWeatherByCityName(cityName: string): Observable<WeatherInfo>;
}