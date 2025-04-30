export interface WeatherResponse {
    latitude: number;
    longitude: number;
    timezone: string;
    elevation: number;
    current: {
        is_day: number;
        temperature_2m: number;
        precipitation: number;
        relative_humidity_2m: number;
        weather_code: number;
        wind_speed_10m: number;
        time: string;
    },
    timezone_abbreviation: string;
    cityName: string;
}