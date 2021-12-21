import { Injectable } from '@angular/core';

import { TimeUnit, WindRoseData } from 'src/app/models/joknuden.models';

import { TungenesApi } from 'src/app/api/tungenes-api';
import { BehaviorSubject, Observable } from 'rxjs';
import { RoutingService } from 'src/app/services/routing.service';
import { RequestPromise } from 'src/app/utils/promise';
import { TimeService } from 'src/app/services/time.service';
import { filter } from 'rxjs/operators';




@Injectable()
export class WindChartsService {

    private _windRoseData$: BehaviorSubject<WindRoseData> = new BehaviorSubject(null);
    public get windRoseData$(): Observable<WindRoseData> {
        return this._windRoseData$;
    }
    public get windRoseData(): WindRoseData {
        return this._windRoseData$.value;
    }

    public get isFetching(): boolean {
        if (this.request) {
            return !this.request.isFulfilled;
        }
        return false;
    }

    constructor(
        private tungenesApi: TungenesApi,
        private routingService: RoutingService,
        private timeService: TimeService,
    ) {
        console.log(this);
        this.init();
    }

    private init(): void {

        console.log('this.routingService.isNavigating', this.routingService.isNavigating);

        this.timeService.timeParams$.pipe(filter(() => !this.routingService.isNavigating)).subscribe(timeParams => {
            this.updateData(timeParams.timeUnit, timeParams.amount);
        });

    }

    private request: RequestPromise<WindRoseData>;

    private async updateData(timeUnit: TimeUnit, amount: number = 1): Promise<void> {

        console.log('WindChartsService.updateData()', timeUnit, amount);

        if (this.request) {
            this.request.abort();
        }

        try {
            const request = this.tungenesApi.getWindroseData(timeUnit, amount);
            this.request = request;
            const windRoseDate = await request;
            this.request = null;
            console.log(windRoseDate);
            this._windRoseData$.next(windRoseDate);
        }
        catch (error) {
            console.error(error);
        }

    }

}
