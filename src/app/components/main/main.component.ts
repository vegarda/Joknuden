import { Component } from '@angular/core';
import { Action, AppService } from 'src/app/services/app.service';
import { RoutingService } from 'src/app/services/routing.service';

@Component({
    selector: 'jok-main',
    templateUrl: 'main.component.html',
    styleUrls: ['main.component.scss'],
})
export class MainComponent {

    constructor(
        private routingService: RoutingService,
        private appService: AppService,
    ) {
        console.log('MainComponent', this);
    }

    public toggleSidenav(): void {
        this.appService.doAction(Action.ToggleSidenav);
    }

}
