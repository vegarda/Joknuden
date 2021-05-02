import { Injectable } from '@angular/core';

import { ArchiveData, TimeUnit } from 'src/app/models/joknuden.models';

import { TungenesApi } from 'src/app/api/tungenes-api';
import { BehaviorSubject, Observable } from 'rxjs';
import { RoutingService } from 'src/app/services/routing.service';


@Injectable()
export class ArchiveChartsService {

    private _archiveData$: BehaviorSubject<ArchiveData[]> = new BehaviorSubject([]);
    public get archiveData$(): Observable<ArchiveData[]> {
        return this._archiveData$;
    }

    constructor(
        private tungenesApi: TungenesApi,
        private routingService: RoutingService,
    ) {
        console.log(this);
        this.init();
    }

    private async init(): Promise<void> {

        this.routingService.urlAfterRedirects$.subscribe(async _urlAfterRedirects => {

            if (this.routingService.isNavigating) {
                return;
            }

            let _timeUnit = TimeUnit.Day;
            let _amount = Number.parseInt(_urlAfterRedirects.replace(/\D/g, ''), 10) || 1;

            console.log('timeUnit', _timeUnit);
            console.log('amount', _amount);

            switch (true) {
                case (_urlAfterRedirects.includes(TimeUnit.Day)): {
                    _timeUnit = TimeUnit.Day;
                    break;
                }
                case (_urlAfterRedirects.includes(TimeUnit.Week)): {
                    _timeUnit = TimeUnit.Week;
                    break;
                }
                case (_urlAfterRedirects.includes(TimeUnit.Month)): {
                    _timeUnit = TimeUnit.Month;
                    break;
                }
                case (_urlAfterRedirects.includes(TimeUnit.Year)): {
                    _timeUnit = TimeUnit.Year;
                    break;
                }
                case (_urlAfterRedirects.includes(TimeUnit.Ytd)): {
                    _timeUnit = TimeUnit.Ytd;
                    _amount = 0;
                    break;
                }
            }

            await this.getArchiveData(_timeUnit, _amount);

        });

    }

    private abortController: AbortController;

    private isFetching: boolean = false;
    private fetchFailed: boolean = false;

    private async getArchiveData(timeUnit: TimeUnit, amount: number = 1, signal?: AbortSignal | null): Promise<void> {

        console.log('ArchiveChartsService.getArchiveData()', timeUnit, amount);

        if (this.abortController) {
            this.abortController.abort();
            this.abortController = null;
        }

        this.isFetching = true;
        this.fetchFailed = false;

        const abortController = new AbortController();
        this.abortController = abortController;
        this._archiveData$.next([]);

        try {
            const archiveData = await this.tungenesApi.getArchiveData(timeUnit, amount, abortController.signal);
            this.fetchFailed = false;
            this.isFetching = false;
            console.log(archiveData);
            this._archiveData$.next(archiveData);
        }
        catch (error) {
            this.isFetching = false;
            this.fetchFailed = true;
            console.error(error);
        }

        if (this.abortController === abortController) {
            this.abortController = null;
        }

    }

}
