import { Component } from '@angular/core';
import { HiLo, HiLoValue } from 'src/app/models/joknuden.models';
import { AppService } from 'src/app/services/app.service';
import { RoutingService } from 'src/app/services/routing.service';
import { HiloService } from './hilo.service';



interface HiLoasdasd {
    label: string;
    average: string;
    high: string;
    highTime: string;
    low: string;
    lowTime: string;
}


@Component({
    selector: 'jok-hilo',
    templateUrl: 'hilo.component.html',
    styleUrls: ['hilo.component.scss'],
})
export class HiloComponent {

    private _data: HiLoasdasd[] = [];
    public get data(): HiLoasdasd[] {
        return this._data;
    }

    public displayedColumns = [
        'label',
        'average',
        'high',
        'highTime',
        'low',
        'lowTime',
    ];

    constructor(
        private routingService: RoutingService,
        private appService: AppService,
        private hiloService: HiloService,
    ) {
        console.log('HiloComponent', this);

        const numberFormatOptions: Intl.NumberFormatOptions = { minimumFractionDigits: 1, maximumFractionDigits: 1, };
        const languages = window.navigator.languages.slice();
        const numberFormat: Intl.NumberFormat = new Intl.NumberFormat(languages, numberFormatOptions);

        const dateTimeFormatOptions: Intl.DateTimeFormatOptions = {
            timeZone: 'Europe/Oslo',
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
        };
        const iso8601Locale = 'sv-Se';
        const hour24LocaleIso8601Locale = `${ iso8601Locale }-u-hc-h23`;
        const dateTimeFormat = Intl.DateTimeFormat(hour24LocaleIso8601Locale, dateTimeFormatOptions);

        const getLabel = (property: keyof HiLo) => {
            switch (property) {
                case 'barometer': {
                    return 'Barometer';
                }
                case 'outTemp': {
                    return 'Temperature';
                }
                case 'windGust': {
                    return 'Wind gust';
                }
                case 'windSpeed': {
                    return 'Wind';
                }
            }
        };

        const shouldShowLow = (property: keyof HiLo) => {
            switch (property) {
                case 'outTemp':
                case 'barometer': {
                    return true;
                }
            }
            return false;
        };

        const getLowTime = (property: keyof HiLo, hiLoValue: HiLoValue) => {
            if (shouldShowLow(property)) {
                return dateTimeFormat.format(new Date(hiLoValue.lowTime * 1000));
            }
            return null;
        };

        const getLow = (property: keyof HiLo, hiLoValue: HiLoValue) => {
            if (shouldShowLow(property)) {
                return numberFormat.format(hiLoValue.low);
            }
            return null;
        };

        this.hiloService.data$.subscribe(hiLoData => {
            if (!hiLoData) {
                this._data = [];
                return;
            }

            this._data = Object.keys(hiLoData).map((key: keyof HiLo) => {
                const hiLoValue = hiLoData[key];
                return {
                    label: getLabel(key),
                    average: numberFormat.format(hiLoValue.average),
                    high: numberFormat.format(hiLoValue.high),
                    highTime: dateTimeFormat.format(new Date(hiLoValue.highTime * 1000)),
                    low: getLow(key, hiLoValue),
                    lowTime: getLowTime(key, hiLoValue),
                }
            });
        });
    }

}
