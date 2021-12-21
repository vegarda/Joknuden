import { ChangeDetectorRef, Component, ViewRef } from '@angular/core';
import { Router } from '@angular/router';
import { Route, routes } from 'src/app/models/joknuden.models';
import { AppService } from 'src/app/services/app.service';
import { RoutingService } from 'src/app/services/routing.service';
import { ArchiveChartsService } from '../charts/archive-charts/archive-charts.service';
import { WindChartsService } from '../charts/wind-charts/wind-charts.service';
import { HiloService } from '../hilo/hilo.service';


@Component({
    selector: 'jok-header',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.scss'],
})
export class HeaderComponent {

    public get showSpinner(): boolean {
        return this.isFetching;
    }

    public get isDisabled(): boolean {
        return this.isFetching;
    }

    public get isFetching(): boolean {
        return this.archiveChartsService.isFetching || this.windChartsService.isFetching || this.hiloService.isFetching;
    }

    private _isMobile: boolean = window.innerWidth <= 768;
    public get isMobile(): boolean {
        return this._isMobile;
    }

    public routes = routes;
    public selectedRoute: Route;

    constructor(
        private router: Router,
        private routingService: RoutingService,
        private appService: AppService,
        private changeDetectorRef: ChangeDetectorRef,
        private archiveChartsService: ArchiveChartsService,
        private windChartsService: WindChartsService,
        private hiloService: HiloService,
    ) {
        console.log('HeaderComponent', this);
        this.routingService.urlAfterRedirects$.subscribe(urlAfterRedirects => {
            this.selectedRoute = this.routes.find(route => route.route === urlAfterRedirects);
        });
    }

    private detectChanges(): void {
        const viewRef = this.changeDetectorRef as ViewRef;
        if (!viewRef.destroyed) {
            viewRef.detectChanges();
        }
    }

    public navigateToRoute(route: string) {
        this.router.navigate([route]);
    }

}
