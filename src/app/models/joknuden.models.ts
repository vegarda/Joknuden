
export enum TimeUnit {
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
