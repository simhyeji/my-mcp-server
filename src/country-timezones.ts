export interface CountryTimezone {
    timezone: string
    city: string
    country: string
    latitude: number
    longitude: number
}

const LOCATIONS = {
    korea: {
        timezone: 'Asia/Seoul',
        city: '서울',
        country: '대한민국',
        latitude: 37.5665,
        longitude: 126.978
    },
    japan: {
        timezone: 'Asia/Tokyo',
        city: '도쿄',
        country: '일본',
        latitude: 35.6762,
        longitude: 139.6503
    },
    china: {
        timezone: 'Asia/Shanghai',
        city: '베이징',
        country: '중국',
        latitude: 39.9042,
        longitude: 116.4074
    },
    usa: {
        timezone: 'America/New_York',
        city: '워싱턴 D.C.',
        country: '미국',
        latitude: 38.9072,
        longitude: -77.0369
    },
    uk: {
        timezone: 'Europe/London',
        city: '런던',
        country: '영국',
        latitude: 51.5074,
        longitude: -0.1278
    },
    france: {
        timezone: 'Europe/Paris',
        city: '파리',
        country: '프랑스',
        latitude: 48.8566,
        longitude: 2.3522
    },
    germany: {
        timezone: 'Europe/Berlin',
        city: '베를린',
        country: '독일',
        latitude: 52.52,
        longitude: 13.405
    },
    italy: {
        timezone: 'Europe/Rome',
        city: '로마',
        country: '이탈리아',
        latitude: 41.9028,
        longitude: 12.4964
    },
    spain: {
        timezone: 'Europe/Madrid',
        city: '마드리드',
        country: '스페인',
        latitude: 40.4168,
        longitude: -3.7038
    },
    russia: {
        timezone: 'Europe/Moscow',
        city: '모스크바',
        country: '러시아',
        latitude: 55.7558,
        longitude: 37.6173
    },
    canada: {
        timezone: 'America/Toronto',
        city: '오타와',
        country: '캐나다',
        latitude: 45.4215,
        longitude: -75.6972
    },
    mexico: {
        timezone: 'America/Mexico_City',
        city: '멕시코시티',
        country: '멕시코',
        latitude: 19.4326,
        longitude: -99.1332
    },
    brazil: {
        timezone: 'America/Sao_Paulo',
        city: '브라질리아',
        country: '브라질',
        latitude: -15.8267,
        longitude: -47.9218
    },
    argentina: {
        timezone: 'America/Argentina/Buenos_Aires',
        city: '부에노스아이레스',
        country: '아르헨티나',
        latitude: -34.6037,
        longitude: -58.3816
    },
    australia: {
        timezone: 'Australia/Sydney',
        city: '캔버라',
        country: '호주',
        latitude: -35.2809,
        longitude: 149.13
    },
    newZealand: {
        timezone: 'Pacific/Auckland',
        city: '웰링턴',
        country: '뉴질랜드',
        latitude: -41.2865,
        longitude: 174.7762
    },
    india: {
        timezone: 'Asia/Kolkata',
        city: '뉴델리',
        country: '인도',
        latitude: 28.6139,
        longitude: 77.209
    },
    singapore: {
        timezone: 'Asia/Singapore',
        city: '싱가포르',
        country: '싱가포르',
        latitude: 1.3521,
        longitude: 103.8198
    },
    thailand: {
        timezone: 'Asia/Bangkok',
        city: '방콕',
        country: '태국',
        latitude: 13.7563,
        longitude: 100.5018
    },
    vietnam: {
        timezone: 'Asia/Ho_Chi_Minh',
        city: '하노이',
        country: '베트남',
        latitude: 21.0285,
        longitude: 105.8542
    },
    philippines: {
        timezone: 'Asia/Manila',
        city: '마닐라',
        country: '필리핀',
        latitude: 14.5995,
        longitude: 120.9842
    },
    indonesia: {
        timezone: 'Asia/Jakarta',
        city: '자카르타',
        country: '인도네시아',
        latitude: -6.2088,
        longitude: 106.8456
    },
    malaysia: {
        timezone: 'Asia/Kuala_Lumpur',
        city: '쿠알라룸푸르',
        country: '말레이시아',
        latitude: 3.139,
        longitude: 101.6869
    },
    taiwan: {
        timezone: 'Asia/Taipei',
        city: '타이베이',
        country: '대만',
        latitude: 25.033,
        longitude: 121.5654
    },
    hongKong: {
        timezone: 'Asia/Hong_Kong',
        city: '홍콩',
        country: '홍콩',
        latitude: 22.3193,
        longitude: 114.1694
    },
    northKorea: {
        timezone: 'Asia/Pyongyang',
        city: '평양',
        country: '북한',
        latitude: 39.0392,
        longitude: 125.7625
    },
    mongolia: {
        timezone: 'Asia/Ulaanbaatar',
        city: '울란바토르',
        country: '몽골',
        latitude: 47.8864,
        longitude: 106.9057
    },
    uae: {
        timezone: 'Asia/Dubai',
        city: '아부다비',
        country: '아랍에미리트',
        latitude: 24.4539,
        longitude: 54.3773
    },
    saudiArabia: {
        timezone: 'Asia/Riyadh',
        city: '리야드',
        country: '사우디아라비아',
        latitude: 24.7136,
        longitude: 46.6753
    },
    turkey: {
        timezone: 'Europe/Istanbul',
        city: '앙카라',
        country: '터키',
        latitude: 39.9334,
        longitude: 32.8597
    },
    egypt: {
        timezone: 'Africa/Cairo',
        city: '카이로',
        country: '이집트',
        latitude: 30.0444,
        longitude: 31.2357
    },
    southAfrica: {
        timezone: 'Africa/Johannesburg',
        city: '프리토리아',
        country: '남아프리카공화국',
        latitude: -25.7479,
        longitude: 28.2293
    },
    switzerland: {
        timezone: 'Europe/Zurich',
        city: '베른',
        country: '스위스',
        latitude: 46.948,
        longitude: 7.4474
    },
    netherlands: {
        timezone: 'Europe/Amsterdam',
        city: '암스테르담',
        country: '네덜란드',
        latitude: 52.3676,
        longitude: 4.9041
    },
    sweden: {
        timezone: 'Europe/Stockholm',
        city: '스톡홀름',
        country: '스웨덴',
        latitude: 59.3293,
        longitude: 18.0686
    },
    norway: {
        timezone: 'Europe/Oslo',
        city: '오슬로',
        country: '노르웨이',
        latitude: 59.9139,
        longitude: 10.7522
    },
    denmark: {
        timezone: 'Europe/Copenhagen',
        city: '코펜하겐',
        country: '덴마크',
        latitude: 55.6761,
        longitude: 12.5683
    },
    finland: {
        timezone: 'Europe/Helsinki',
        city: '헬싱키',
        country: '핀란드',
        latitude: 60.1699,
        longitude: 24.9384
    },
    poland: {
        timezone: 'Europe/Warsaw',
        city: '바르샤바',
        country: '폴란드',
        latitude: 52.2297,
        longitude: 21.0122
    },
    portugal: {
        timezone: 'Europe/Lisbon',
        city: '리스본',
        country: '포르투갈',
        latitude: 38.7223,
        longitude: -9.1393
    },
    greece: {
        timezone: 'Europe/Athens',
        city: '아테네',
        country: '그리스',
        latitude: 37.9838,
        longitude: 23.7275
    },
    ireland: {
        timezone: 'Europe/Dublin',
        city: '더블린',
        country: '아일랜드',
        latitude: 53.3498,
        longitude: -6.2603
    },
    belgium: {
        timezone: 'Europe/Brussels',
        city: '브뤼셀',
        country: '벨기에',
        latitude: 50.8503,
        longitude: 4.3517
    },
    austria: {
        timezone: 'Europe/Vienna',
        city: '빈',
        country: '오스트리아',
        latitude: 48.2082,
        longitude: 16.3738
    },
    czechia: {
        timezone: 'Europe/Prague',
        city: '프라하',
        country: '체코',
        latitude: 50.0755,
        longitude: 14.4378
    },
    hungary: {
        timezone: 'Europe/Budapest',
        city: '부다페스트',
        country: '헝가리',
        latitude: 47.4979,
        longitude: 19.0402
    },
    israel: {
        timezone: 'Asia/Jerusalem',
        city: '예루살렘',
        country: '이스라엘',
        latitude: 31.7683,
        longitude: 35.2137
    },
    qatar: {
        timezone: 'Asia/Qatar',
        city: '도하',
        country: '카타르',
        latitude: 25.2854,
        longitude: 51.531
    },
    chile: {
        timezone: 'America/Santiago',
        city: '산티아고',
        country: '칠레',
        latitude: -33.4489,
        longitude: -70.6693
    },
    colombia: {
        timezone: 'America/Bogota',
        city: '보고타',
        country: '콜롬비아',
        latitude: 4.711,
        longitude: -74.0721
    },
    peru: {
        timezone: 'America/Lima',
        city: '리마',
        country: '페루',
        latitude: -12.0464,
        longitude: -77.0428
    }
} as const satisfies Record<string, CountryTimezone>

type LocationKey = keyof typeof LOCATIONS

const ALIASES: Record<string, LocationKey> = {
    한국: 'korea',
    대한민국: 'korea',
    korea: 'korea',
    'south korea': 'korea',
    kr: 'korea',
    일본: 'japan',
    japan: 'japan',
    jp: 'japan',
    중국: 'china',
    china: 'china',
    cn: 'china',
    미국: 'usa',
    usa: 'usa',
    us: 'usa',
    'united states': 'usa',
    'united states of america': 'usa',
    영국: 'uk',
    uk: 'uk',
    'united kingdom': 'uk',
    england: 'uk',
    gb: 'uk',
    프랑스: 'france',
    france: 'france',
    fr: 'france',
    독일: 'germany',
    germany: 'germany',
    de: 'germany',
    이탈리아: 'italy',
    italy: 'italy',
    it: 'italy',
    스페인: 'spain',
    spain: 'spain',
    es: 'spain',
    러시아: 'russia',
    russia: 'russia',
    ru: 'russia',
    캐나다: 'canada',
    canada: 'canada',
    ca: 'canada',
    멕시코: 'mexico',
    mexico: 'mexico',
    mx: 'mexico',
    브라질: 'brazil',
    brazil: 'brazil',
    br: 'brazil',
    아르헨티나: 'argentina',
    argentina: 'argentina',
    ar: 'argentina',
    호주: 'australia',
    오스트레일리아: 'australia',
    australia: 'australia',
    au: 'australia',
    뉴질랜드: 'newZealand',
    'new zealand': 'newZealand',
    nz: 'newZealand',
    인도: 'india',
    india: 'india',
    in: 'india',
    싱가포르: 'singapore',
    singapore: 'singapore',
    sg: 'singapore',
    태국: 'thailand',
    thailand: 'thailand',
    th: 'thailand',
    베트남: 'vietnam',
    vietnam: 'vietnam',
    vn: 'vietnam',
    필리핀: 'philippines',
    philippines: 'philippines',
    ph: 'philippines',
    인도네시아: 'indonesia',
    indonesia: 'indonesia',
    id: 'indonesia',
    말레이시아: 'malaysia',
    malaysia: 'malaysia',
    my: 'malaysia',
    대만: 'taiwan',
    taiwan: 'taiwan',
    tw: 'taiwan',
    홍콩: 'hongKong',
    'hong kong': 'hongKong',
    hk: 'hongKong',
    북한: 'northKorea',
    'north korea': 'northKorea',
    kp: 'northKorea',
    몽골: 'mongolia',
    mongolia: 'mongolia',
    mn: 'mongolia',
    아랍에미리트: 'uae',
    uae: 'uae',
    'united arab emirates': 'uae',
    ae: 'uae',
    두바이: 'uae',
    사우디아라비아: 'saudiArabia',
    'saudi arabia': 'saudiArabia',
    sa: 'saudiArabia',
    터키: 'turkey',
    튀르키예: 'turkey',
    turkey: 'turkey',
    tr: 'turkey',
    이집트: 'egypt',
    egypt: 'egypt',
    eg: 'egypt',
    남아프리카공화국: 'southAfrica',
    남아공: 'southAfrica',
    'south africa': 'southAfrica',
    za: 'southAfrica',
    스위스: 'switzerland',
    switzerland: 'switzerland',
    ch: 'switzerland',
    네덜란드: 'netherlands',
    netherlands: 'netherlands',
    nl: 'netherlands',
    스웨덴: 'sweden',
    sweden: 'sweden',
    se: 'sweden',
    노르웨이: 'norway',
    norway: 'norway',
    no: 'norway',
    덴마크: 'denmark',
    denmark: 'denmark',
    dk: 'denmark',
    핀란드: 'finland',
    finland: 'finland',
    fi: 'finland',
    폴란드: 'poland',
    poland: 'poland',
    pl: 'poland',
    포르투갈: 'portugal',
    portugal: 'portugal',
    pt: 'portugal',
    그리스: 'greece',
    greece: 'greece',
    gr: 'greece',
    아일랜드: 'ireland',
    ireland: 'ireland',
    ie: 'ireland',
    벨기에: 'belgium',
    belgium: 'belgium',
    be: 'belgium',
    오스트리아: 'austria',
    austria: 'austria',
    at: 'austria',
    체코: 'czechia',
    'czech republic': 'czechia',
    czechia: 'czechia',
    cz: 'czechia',
    헝가리: 'hungary',
    hungary: 'hungary',
    hu: 'hungary',
    이스라엘: 'israel',
    israel: 'israel',
    il: 'israel',
    카타르: 'qatar',
    qatar: 'qatar',
    qa: 'qatar',
    칠레: 'chile',
    chile: 'chile',
    cl: 'chile',
    콜롬비아: 'colombia',
    colombia: 'colombia',
    co: 'colombia',
    페루: 'peru',
    peru: 'peru',
    pe: 'peru'
}

function normalizeCountryName(name: string): string {
    return name.trim().toLowerCase().replace(/\s+/g, ' ')
}

export function findCountryTimezone(
    countryName?: string
): CountryTimezone | undefined {
    const normalized = countryName ? normalizeCountryName(countryName) : ''

    if (!normalized) {
        return LOCATIONS.korea
    }

    const exactKey = ALIASES[normalized]
    if (exactKey) {
        return LOCATIONS[exactKey]
    }

    if (normalized.length < 2) {
        return undefined
    }

    const match = Object.entries(ALIASES).find(([alias]) => {
        if (alias.includes(normalized)) {
            return true
        }

        return alias.length >= 3 && normalized.includes(alias)
    })

    return match ? LOCATIONS[match[1]] : undefined
}

export function formatCurrentTime(info: CountryTimezone): string {
    const now = new Date()
    const formatted = new Intl.DateTimeFormat('ko-KR', {
        timeZone: info.timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZoneName: 'short'
    }).format(now)

    return `${info.country} (${info.city})의 현재 시간은 ${formatted}입니다.`
}
