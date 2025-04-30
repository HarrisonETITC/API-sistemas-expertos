import { WeatherIconStyle } from "./weathericonstyle";

export interface WeatherInfo {
    weatherName: string;
    wind: string;
    humidity: string;
    cityName: string;
    temperature: string;
    elevation?: number;
    country?: string;
    timezone?: string;
    hour?: string;
    icon?: WeatherIconStyle;
}
