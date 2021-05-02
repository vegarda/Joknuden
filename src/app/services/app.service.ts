import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { RoutingService } from './routing.service';

export enum Action {
    OpenSidenav = 'OpenSidenav',
    ToggleSidenav = 'ToggleSidenav',
    CloseSidenav = 'CloseSidenav',
}

@Injectable({
    providedIn: 'root',
})
export class AppService {

    private _action$: Subject<Action> = new Subject();
    public get action$(): Observable<Action> {
        return this._action$;
    }

    constructor(
        private routingService: RoutingService,
    ) {
        console.log(this);
    }

    public doAction(action: Action): void {
        this._action$.next(action);
    }

}
