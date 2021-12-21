import { Injectable } from '@angular/core';

import { ArchiveData, HiLo, TimeUnit } from 'src/app/models/joknuden.models';

import { TungenesApi } from 'src/app/api/tungenes-api';
import { BehaviorSubject, Observable } from 'rxjs';
import { RoutingService } from 'src/app/services/routing.service';
import { RequestPromise } from 'src/app/utils/promise';
import { TimeParams, TimeService } from 'src/app/services/time.service';
import { filter } from 'rxjs/operators';









@Injectable({
    providedIn: 'root',
})
export class HiloService {

    private _data$: BehaviorSubject<HiLo> = new BehaviorSubject(null);
    public get data$(): Observable<HiLo> {
        return this._data$;
    }
    public get data(): HiLo {
        return this._data$.value;
    }

    public get isFetching(): boolean {
        if (this.request) {
            return !this.request.isFulfilled;
        }
        return false;
    }

    constructor(
        private routingService: RoutingService,
        private tungenesApi: TungenesApi,
        private timeService: TimeService,
    ) {
        console.log(this);
        this.init();
    }

    private init(): void {
        this.timeService.timeParams$.pipe(filter(() => !this.routingService.isNavigating)).subscribe(timeParams => {
            this.updateData(timeParams.timeUnit, timeParams.amount);
        });
    }

    private request: RequestPromise<any>;

    private async updateData(timeUnit: TimeUnit, amount: number = 1): Promise<void> {

        console.log('HiloService.geteData()', timeUnit, amount);

        if (this.request) {
            this.request.abort();
        }

        try {
            const request = this.tungenesApi.getHiLoData(timeUnit, amount);
            this.request = request;
            const archiveData = await request;
            this.request = null;
            console.log(archiveData);
            this._data$.next(archiveData);
        }
        catch (error) {
            console.error(error);
        }

    }

}
