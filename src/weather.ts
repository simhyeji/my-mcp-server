import type { CountryTimezone } from './country-timezones'
import { formatCurrentTime } from './country-timezones'

export interface WeatherLocation {
    latitude: number
    longitude: number
    timezone?: string
}

export interface CurrentWeather {
    temperature: number
    apparentTemperature: number
    humidity: number
    windSpeed: number
    description: string
}

interface OpenMeteoResponse {
    current?: {
        temperature_2m?: number
        apparent_temperature?: number
        relative_humidity_2m?: number
        weather_code?: number
        wind_speed_10m?: number
    }
}

function describeWeatherCode(code: number): string {
    if (code === 0) return '맑음'
    if (code === 1) return '대체로 맑음'
    if (code === 2) return '부분적으로 흐림'
    if (code === 3) return '흐림'
    if (code === 45 || code === 48) return '안개'
    if (code === 51 || code === 53 || code === 55) return '이슬비'
    if (code === 56 || code === 57) return '언 이슬비'
    if (code === 61 || code === 63 || code === 65) return '비'
    if (code === 66 || code === 67) return '언 비'
    if (code === 71 || code === 73 || code === 75) return '눈'
    if (code === 77) return '싸락눈'
    if (code === 80 || code === 81 || code === 82) return '소나기'
    if (code === 85 || code === 86) return '눈 소나기'
    if (code === 95) return '뇌우'
    if (code === 96 || code === 99) return '우박을 동반한 뇌우'
    return '알 수 없음'
}

export async function fetchCurrentWeather(
    location: WeatherLocation
): Promise<CurrentWeather | undefined> {
    const url = new URL('https://api.open-meteo.com/v1/forecast')
    url.searchParams.set('latitude', String(location.latitude))
    url.searchParams.set('longitude', String(location.longitude))
    url.searchParams.set(
        'current',
        'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m'
    )
    url.searchParams.set('timezone', location.timezone ?? 'auto')
    url.searchParams.set('wind_speed_unit', 'ms')

    try {
        const response = await fetch(url, {
            signal: AbortSignal.timeout(8000)
        })

        if (!response.ok) {
            return undefined
        }

        const data = (await response.json()) as OpenMeteoResponse
        const current = data.current

        if (
            current?.temperature_2m === undefined ||
            current.weather_code === undefined
        ) {
            return undefined
        }

        return {
            temperature: current.temperature_2m,
            apparentTemperature: current.apparent_temperature ?? current.temperature_2m,
            humidity: current.relative_humidity_2m ?? 0,
            windSpeed: current.wind_speed_10m ?? 0,
            description: describeWeatherCode(current.weather_code)
        }
    } catch {
        return undefined
    }
}

export function formatTimeAndWeather(
    info: CountryTimezone,
    weather?: CurrentWeather
): string {
    const timeText = formatCurrentTime(info)

    if (!weather) {
        return `${timeText}\n날씨 정보를 가져오지 못했습니다.`
    }

    return [timeText, formatWeatherSummary(weather)].join('\n')
}

export function formatWeather(
    location: WeatherLocation,
    weather: CurrentWeather
): string {
    return [
        `위치: 위도 ${location.latitude}, 경도 ${location.longitude}`,
        formatWeatherSummary(weather)
    ].join('\n')
}

function formatWeatherSummary(weather: CurrentWeather): string {
    return [
        `날씨: ${weather.description}`,
        `기온 ${weather.temperature}°C (체감 ${weather.apparentTemperature}°C)`,
        `습도 ${weather.humidity}%, 풍속 ${weather.windSpeed}m/s`
    ].join('\n')
}
