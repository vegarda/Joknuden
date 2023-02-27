import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ConsoleService, ConsoleData } from './console.service';

type ConsoleDataProperty = Exclude<keyof ConsoleData, 'dateTime'>;

interface Config {
    label: string;
    icon: string;
    property: ConsoleDataProperty;
    unit: string;
    numberFormatOptions?: Intl.NumberFormatOptions;
}

@Component({
    selector: 'jok-console',
    templateUrl: './console.component.html',
    styleUrls: ['./console.component.scss'],
})
export class ConsoleComponent implements OnInit, OnDestroy {

    public temperatureConfig: Config = {
        property: 'outTemp',
        unit: '°C',
        icon: 'wi-thermometer',
        numberFormatOptions: {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
        },
        label: 'Temperature',
    };

    public readonly configs: ReadonlyArray<Config> = [
        {
            property: 'outTemp',
            unit: '°C',
            icon: 'wi-thermometer',
            numberFormatOptions: {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
            },
            label: 'Temperature',
        },
        {
            property: 'barometer',
            unit: 'hPa',
            icon: 'wi-barometer',
            numberFormatOptions: {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
            },
            label: 'Barometer',
        },
        /*
        {
            property: 'outHumidity',
            unit: '%',
            icon: 'wi-humidity',
            numberFormatOptions: {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            },
            label: 'Humidity',
        },
        */
        {
            property: 'dayRain',
            unit: 'mm',
            // icon: 'wi-raindrop',
            icon: 'wi-raindrops',
            numberFormatOptions: {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
            },
            label: 'Rain',
        },
    ];

    public get data$(): Observable<ConsoleData> {
        return this.consoleService.data$;
    }
    public get data(): ConsoleData {
        return this.consoleService.data;
    }


    private onDestroy$ = new Subject<void>();

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private consoleService: ConsoleService,
    ) {
        console.log('ConsoleComponent', this);
    }

    public ngOnInit(): void {
        this.consoleService.data$.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
            this.detectChanges();
        });
    }

    public ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

    private detectChanges(): void {
        if (!(this.changeDetectorRef as ViewRef).destroyed) {
            this.changeDetectorRef.detectChanges();
        }
    }


}
