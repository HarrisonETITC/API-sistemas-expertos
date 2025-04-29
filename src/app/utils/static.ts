import { WeatherIconStyle } from "./weathericonstyle";

export const defaultCities = [
    "Bogotá",
    "Madrid",
    "Nueva York",
    "Barcelona",
    "Londres",
    "París",
    "Ciudad de México",
    "Berlín",
    "Sídney",
    "Toronto",
    "El Cairo",
    "Moscú",
    "Pekín",
    "Buenos Aires",
    "Estambul",
    "Seúl",
    "Bangkok",
    "Yakarta"
]

export const weatherCodeDescriptions: { [code: number]: string } = {
    0: "Cielo despejado",
    1: "Principalmente despejado",
    2: "Parcialmente nublado",
    3: "Nublado",
    45: "Niebla",
    48: "Niebla con escarcha depositada",
    51: "Llovizna ligera",
    53: "Llovizna moderada",
    55: "Llovizna densa",
    56: "Llovizna helada ligera",
    57: "Llovizna helada densa",
    61: "Lluvia ligera",
    63: "Lluvia moderada",
    65: "Lluvia intensa",
    66: "Lluvia helada ligera",
    67: "Lluvia helada intensa",
    71: "Nevada ligera",
    73: "Nevada moderada",
    75: "Nevada intensa",
    77: "Granos de nieve",
    80: "Chubascos de lluvia ligeros",
    81: "Chubascos de lluvia moderados",
    82: "Chubascos de lluvia violentos",
    85: "Chubascos de nieve ligeros",
    86: "Chubascos de nieve intensos",
    95: "Tormenta eléctrica ligera o moderada",
    96: "Tormenta eléctrica con granizo ligero",
    99: "Tormenta eléctrica con granizo fuerte",
};

const weatherCodeIcons: { [code: number]: WeatherIconStyle } = {
    3: { icon: "filter_drama", color: "#fff" },
    45: { icon: "filter_drama", color: "#fff" },
    48: { icon: "weather_mix", color: "#fff" },
    51: { icon: "rainy", color: "#fff" },
    53: { icon: "rainy", color: "#fff" },
    55: { icon: "rainy_heavy", color: "#fff" },
    56: { icon: "snowing_heavy", color: "#fff" },
    57: { icon: "snowing_heavy", color: "#fff" },
    61: { icon: "rainy_light", color: "#fff" },
    63: { icon: "rainy_light", color: "#fff" },
    65: { icon: "rainy_heavy", color: "#fff" },
    66: { icon: "snowing_heavy", color: "#fff" },
    67: { icon: "snowing_heavy", color: "#fff" },
    71: { icon: "weather_snowy", color: "#fff" },
    73: { icon: "weather_snowy", color: "#fff" },
    75: { icon: "severe_cold", color: "#fff" },
    77: { icon: "mode_cool", color: "#fff" },
    80: { icon: "cloud", color: "#fff" },
    81: { icon: "cloud", color: "#fff" },
    82: { icon: "foggy", color: "#fff" },
    85: { icon: "mode_dual", color: "#fff" },
    86: { icon: "mode_dual", color: "#fff" },
    95: { icon: "thunderstorm", color: "#fff" },
    96: { icon: "thunderstorm", color: "#fff" },
    99: { icon: "thunderstorm", color: "#fff" },
};

export const getWeatherIcon = (code: number, isDay: number): WeatherIconStyle => {
    if (code == 0 || code == 1 || code == 2) {
        if (code == 0) return isDay == 0 ? { icon: "moon_stars", color: "#fff" } : { icon: "sunny", color: "#fff" };
        
        return isDay == 0 ? { icon: "partly_cloudy_night", color: "#fff" } : { icon: "partly_cloudy_day", color: "#fff" };
    }

    return weatherCodeIcons[code];
}
