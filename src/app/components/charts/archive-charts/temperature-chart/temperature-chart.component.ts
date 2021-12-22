import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { ArchiveData } from 'src/app/models/joknuden.models';
import { ChartComponent } from '../../chart/chart.component';
import { ArchiveChartsService } from '../archive-charts.service';


interface ArchiveDataX extends Omit<ArchiveData, 'dateTime'> {
    dateTime: Date;
}


@Component({
    selector: 'jok-temperature-chart',
    templateUrl: '../../chart/chart.component.html',
    styleUrls: [
        '../../chart/chart.component.scss',
        'temperature-chart.component.scss',
    ],
})
export class TemperatureChartComponent extends ChartComponent<ArchiveDataX> {

    private onDestroy$ = new Subject();

    constructor(
        private archiveChartsService: ArchiveChartsService,
    ) {
        super();
    }

    public ngOnInit(): void {

        this.prop="outTemp";
        this.areaMinProp="minOutTemp";
        this.areaMaxProp="maxOutTemp";
        this.timeProp="dateTime";
        this.unit="°C";

        this.archiveChartsService.archiveData$.subscribe(archiveData => {
            this._data = archiveData.map(_ad => {
                return Object.assign({}, _ad, { dateTime: new Date(_ad.dateTime * 1000) });
            });
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
        console.log('TemperatureChartComponent.draw()');
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
