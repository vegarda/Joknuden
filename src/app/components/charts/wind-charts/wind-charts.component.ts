
import { ChangeDetectorRef, Component, OnInit, QueryList, ViewChild, ViewChildren, ViewRef } from '@angular/core';
import { WindRoseData } from 'src/app/models/joknuden.models';
import { ChartComponent } from '../chart/chart.component';
import { WindChartsService } from './wind-charts.service';




@Component({
    selector: 'jok-wind-charts',
    templateUrl: 'wind-charts.component.html',
    styleUrls: ['wind-charts.component.scss'],
})
export class WindChartsComponent implements OnInit {

    @ViewChildren(ChartComponent)
    private chartComponents: QueryList<ChartComponent>;

    public get windRoseData(): WindRoseData {
        return this.windChartsService.windRoseData;
    }

    public get windFrequency(): number[] {
        return this.windChartsService.windRoseData?.windFrequency;
    }
    public get windVector(): number[] {
        return this.windChartsService.windRoseData?.windVector;
    }
    public get windVelocity(): number[] {
        return this.windChartsService.windRoseData?.windVelocity;
    }

    constructor(
        private windChartsService: WindChartsService,
        private changeDetectorRef: ChangeDetectorRef,
    ) { }

    public async ngOnInit(): Promise<void> {

        this.windChartsService.windRoseData$.subscribe(() => {
            this.detectChanges();
            this.test();
        });

    }

    public ngAfterViewInit(): void {
        console.log('chartComponents', this.chartComponents);
        this.test();
    }

    private detectChanges(): void {
        const viewRef = this.changeDetectorRef as ViewRef;
        if (!viewRef.destroyed) {
            viewRef.detectChanges();
        }
    }

    private test(): void {
        console.log('WindChartsComponent.test()', this.chartComponents);
        console.log('windRoseData', this.windRoseData);
        console.log('windFrequency', this.windFrequency);
        if (this.chartComponents) {
            this.chartComponents.forEach(cc => {
                cc.drawWindrose();
            });
        }
    }

}

