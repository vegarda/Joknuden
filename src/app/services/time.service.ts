import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { TimeUnit } from 'src/app/models/joknuden.models';
import { RoutingService } from 'src/app/services/routing.service';

export interface TimeParams {
    timeUnit: TimeUnit;
    amount: number;
}


@Injectable({
    providedIn: 'root',
})
export class TimeService {

    private _timeParams$ = new BehaviorSubject<TimeParams>({ timeUnit: TimeUnit.Day, amount: 1 });
    public get timeParams(): TimeParams {
        return this._timeParams$.value;
    }
    public get timeParams$(): Observable<TimeParams> {
        return this._timeParams$;
    }


    constructor(
        private routingService: RoutingService,
    ) {
        console.log(this);
        this.init();
    }

    private init(): void {

        this.routingService.urlAfterRedirects$.subscribe(_urlAfterRedirects => {

            if (this.routingService.isNavigating) {
                return;
            }

            _urlAfterRedirects = _urlAfterRedirects.toLowerCase();

            let _timeUnit = TimeUnit.Day;
            let _amount = Number.parseInt(_urlAfterRedirects.replace(/\D/g, ''), 10) || 1;

            switch (true) {
                case (_urlAfterRedirects.includes(TimeUnit.Yesterday)): {
                    _timeUnit = TimeUnit.Yesterday;
                    _amount = 0;
                    break;
                }
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

            console.log('timeUnit', _timeUnit);
            console.log('amount', _amount);

            this._timeParams$.next({
                timeUnit: _timeUnit,
                amount: _amount,
            })

        });

    }

}
