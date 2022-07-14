import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { ArchiveDataX } from 'src/app/models/joknuden.models';
import { ChartComponent } from '../../chart/chart.component';
import { ArchiveChartsService } from '../archive-charts.service';


@Component({
    selector: 'jok-wind-chart',
    templateUrl: '../../chart/chart.component.html',
    styleUrls: [
        '../../chart/chart.component.scss',
        'wind-chart.component.scss',
    ],
})
export class WindChartComponent extends ChartComponent<ArchiveDataX> {

    private onDestroy$ = new Subject();

    constructor(
        private archiveChartsService: ArchiveChartsService,
    ) {
        super();
    }

    public ngOnInit(): void {

        // this.prop = 'windSpeed';
        this.areaMinProp = 'windSpeed';
        this.areaMaxProp = 'windGust';
        this.timeProp = 'dateTime';
        this.unit = 'm/s';

        this.archiveChartsService.archiveDataX$.subscribe(archiveDataX => {
            this._data = archiveDataX;
            this.draw();
        });
    }

    public ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

    public ngAfterViewInit(): void {
        super.ngAfterViewInit();
        this.draw();
    }

    protected draw(): void {
        console.log('WindChartComponent.draw()');
        if (!this.d3Painter) {
            console.warn('!this.d3Painter');
            return;
        }
        this.resetSvg();
        this.setTimeScale();
        this.setYAxisLines();
        this.addArea();
        this.addLine();
        this.setYAxisText();
    }



}
