import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Navigation, NavigationEnd, ParamMap, Params, Router, RouterState, RouterStateSnapshot } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
    providedIn: 'root',
})
export class RoutingService {

    private _urlAfterRedirects$: BehaviorSubject<string> = new BehaviorSubject('');
    public get urlAfterRedirects$(): Observable<string> {
        return this._urlAfterRedirects$;
    }
    public get urlAfterRedirects(): string {
        return this._urlAfterRedirects$.value;
    }

    public get routerState(): RouterState {
        return this.router.routerState;
    }

    public get routerStateSnapshot(): RouterStateSnapshot {
        return this.router.routerState.snapshot;
    }

    public get activatedRouteSnapshot(): ActivatedRouteSnapshot {
        let activatedRouteSnapshot = this.routerStateSnapshot.root;
        while (activatedRouteSnapshot.firstChild) {
            activatedRouteSnapshot = activatedRouteSnapshot.firstChild;
        }
        return activatedRouteSnapshot;
    }

    public get paramMap(): ParamMap {
        const activatedRouteSnapshot = this.activatedRouteSnapshot;
        if (activatedRouteSnapshot) {
            return activatedRouteSnapshot.paramMap;
        }
        return null;
    }

    public get queryParamMap(): ParamMap {
        const activatedRouteSnapshot = this.activatedRouteSnapshot;
        if (activatedRouteSnapshot) {
            return activatedRouteSnapshot.queryParamMap;
        }
        return null;
    }

    public get queryParams(): Params {
        const activatedRouteSnapshot = this.activatedRouteSnapshot;
        if (activatedRouteSnapshot) {
            return activatedRouteSnapshot.queryParams;
        }
        return {};
    }

    public get params(): Params {
        const activatedRouteSnapshot = this.activatedRouteSnapshot;
        if (activatedRouteSnapshot) {
            return activatedRouteSnapshot.params;
        }
        return {};
    }

    public get currentNavigation(): Navigation {
        return this.router.getCurrentNavigation();
    }

    private _isNavigating: boolean = false;
    public get isNavigating(): boolean {
        return this._isNavigating;
    }

    constructor(
        private router: Router,
    ) {
        console.log(this);

        this.router.events.subscribe(event => {
            // console.log(event);

            switch (true) {
                default: {
                    this._isNavigating = true;
                    break;
                }
                case (event instanceof NavigationEnd): {
                    this._isNavigating = false;
                    console.log(event);
                    const navigationEnd = event as NavigationEnd;
                    const urlAfterRedirects = navigationEnd.urlAfterRedirects;
                    console.log('urlAfterRedirects', urlAfterRedirects);
                    this._urlAfterRedirects$.next(urlAfterRedirects);
                }
            }

        });

    }

}
