import { WeatherIconStyle } from "./weathericonstyle";

export interface WeatherInfo {
    weatherName: string;
    wind: string;
    humidity: string;
    cityName: string;
    temperature: string;
    icon?: WeatherIconStyle;
}
