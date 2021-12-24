import { Component, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Action, AppService } from './services/app.service';
import { RoutingService } from './services/routing.service';

@Component({
    selector: 'jok-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {

    @ViewChild(MatDrawer, { static: true }) private drawer!: MatDrawer;

    constructor(
        private routingService: RoutingService,
        private appService: AppService,
    ) {
        console.log('AppComponent ', this);

        this.appService.action$.subscribe(action => {
            switch(action) {
                case Action.CloseSidenav: {
                    this.drawer.close();
                    break;
                }
                case Action.OpenSidenav: {
                    this.drawer.open();
                    break;
                }
                case Action.ToggleSidenav: {
                    this.drawer.toggle();
                    break;
                }
            }
        });

    }

}
