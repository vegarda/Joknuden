
export enum TimeUnit {
    Yesterday = 'yesterday',
    Day = 'day',
    Week = 'week',
    Month = 'month',
    Year = 'year',
    Ytd = 'ytd',
}


export interface ArchiveData {
    barometer: number;
    dateTime: number;
    maxOutTemp: number;
    minOutTemp: number;
    outHumidity: number;
    outTemp: number;
    rain: number;
    rainRate: number;
    windDir: number;
    windGust: number;
    windGustDir: number;
    windSpeed: number;
}

export interface WindRoseData {
    windFrequency: number[];
    windVector: number[];
    windVelocity: number[];
}



export interface HiLoValue {
    high: number;
    highTime: number;
    low: number;
    lowTime: number;
    average: number;
}

export interface HiLo {
    outTemp: HiLoValue;
    barometer: HiLoValue;
    windSpeed: HiLoValue;
    windGust: HiLoValue;
}


export interface Route {
    label: string;
    route: string
}


export const routes: ReadonlyArray<Route> = [
    {
        label: 'yesterday',
        route: '/yesterday',
    },
    {
        label: 'today',
        route: '/',
    },
    {
        label: '3 day',
        route: '/day/3',
    },
    {
        label: '1 week',
        route: '/week/1',
    },
    {
        label: '2 week',
        route: '/week/2',
    },
    {
        label: '1 month',
        route: '/month/1',
    },
    {
        label: '2 month',
        route: '/month/2',
    },
    {
        label: '3 month',
        route: '/month/3',
    },
    {
        label: '6 month',
        route: '/month/6',
    },
    {
        label: 'YTD',
        route: '/ytd',
    },
];
