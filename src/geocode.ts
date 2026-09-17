export interface GeocodedLocation {
    name: string
    latitude: number
    longitude: number
    country?: string
    admin1?: string
    timezone?: string
}

interface OpenMeteoGeocodingResult {
    name?: string
    latitude?: number
    longitude?: number
    country?: string
    admin1?: string
    timezone?: string
}

interface OpenMeteoGeocodingResponse {
    results?: OpenMeteoGeocodingResult[]
}

const HANGUL_TWO_CHARS = /^[가-힣]{2}$/
const KOREAN_PLACE_SUFFIXES = [
    '특별시',
    '광역시',
    '시',
    '특별자치도',
    '특별자치시',
    '도'
]

async function searchOnce(
    name: string,
    count: number
): Promise<GeocodedLocation[] | undefined> {
    const url = new URL('https://geocoding-api.open-meteo.com/v1/search')
    url.searchParams.set('name', name)
    url.searchParams.set('count', String(count))
    url.searchParams.set('language', 'ko')

    try {
        const response = await fetch(url, {
            signal: AbortSignal.timeout(8000)
        })

        if (!response.ok) {
            return undefined
        }

        const data = (await response.json()) as OpenMeteoGeocodingResponse

        return (data.results ?? [])
            .filter(
                (
                    result
                ): result is OpenMeteoGeocodingResult & {
                    name: string
                    latitude: number
                    longitude: number
                } =>
                    result.name !== undefined &&
                    result.latitude !== undefined &&
                    result.longitude !== undefined
            )
            .map((result) => ({
                name: result.name,
                latitude: result.latitude,
                longitude: result.longitude,
                country: result.country,
                admin1: result.admin1,
                timezone: result.timezone
            }))
    } catch {
        return undefined
    }
}

export async function searchLocations(
    query: string,
    count = 5
): Promise<GeocodedLocation[] | undefined> {
    const trimmed = query.trim()

    if (trimmed.length < 2) {
        return []
    }

    const results = await searchOnce(trimmed, count)

    if (results === undefined || results.length > 0 || !HANGUL_TWO_CHARS.test(trimmed)) {
        return results
    }

    for (const suffix of KOREAN_PLACE_SUFFIXES) {
        const expanded = await searchOnce(`${trimmed}${suffix}`, count)

        if (expanded === undefined) {
            return undefined
        }

        if (expanded.length > 0) {
            return expanded
        }
    }

    return []
}

export function formatGeocodedLocation(location: GeocodedLocation): string {
    const place = [location.name, location.country].filter(Boolean).join(', ')
    const region = location.admin1 ? ` (${location.admin1})` : ''
    const timezone = location.timezone ? `, 타임존 ${location.timezone}` : ''

    return `${place}${region} — 위도 ${location.latitude}, 경도 ${location.longitude}${timezone}`
}
