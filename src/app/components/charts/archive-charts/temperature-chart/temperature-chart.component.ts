import { Component, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { ArchiveData } from 'src/app/models/joknuden.models';
import { ChartComponent } from '../../chart.component';
import { ArchiveChartsService } from '../archive-charts.service';

interface ArchiveDataX extends Omit<ArchiveData, 'dateTime'> {
    dateTime: Date;
}


@Component({
    selector: 'jok-temperature-chart',
    template: `<jok-chart [data]="archiveData" prop="outTemp" areaMinProp="minOutTemp" areaMaxProp="maxOutTemp" timeProp="dateTime" unit="°C"></jok-chart>`,
    styleUrls: ['temperature-chart.component.scss'],
})
export class TemperatureChartComponent {

    @ViewChild(ChartComponent, { static: true })
    private chartComponent: ChartComponent;

    private _archiveDataX: ArchiveDataX[] = [];
    public get archiveData(): ArchiveDataX[] {
        return this._archiveDataX;
    }

    private onDestroy$ = new Subject();

    constructor(
        private archiveChartsService: ArchiveChartsService,
    ) { }

    public ngOnInit(): void {
        console.log(this);
        this.archiveChartsService.archiveData$.subscribe(archiveData => {
            this._archiveDataX = archiveData.map(_ad => {
                return Object.assign({}, _ad, { dateTime: new Date(_ad.dateTime * 1000) });
            });
        });
    }

    public ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }



}
