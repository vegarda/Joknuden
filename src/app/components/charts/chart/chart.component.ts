import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { KeysOfType } from 'src/app/types/types';
import { d3Painter } from '../d3-painter';


@Component({
    selector: 'jok-chart',
    templateUrl: 'chart.component.html',
    styleUrls: ['chart.component.scss'],
    // encapsulation: ViewEncapsulation.None,
})
export class ChartComponent<T = unknown> {

    @ViewChild('svgRef', { static: true }) private svgRef: ElementRef<SVGSVGElement>;

    @Input() public prop: KeysOfType<T, number>;

    @Input() public areaMinProp: KeysOfType<T, number>;
    @Input() public areaMaxProp: KeysOfType<T, number>;

    @Input() public timeProp: KeysOfType<T, Date>;

    @Input() public unit: string = '';

    protected _data: T[] = [];
    @Input() public set data(data: T[]) {
        if (Array.isArray(data)) {
            this._data = data;
        }
        else {
            this._data = [];
        }
    }

    protected d3Painter: d3Painter<T>;

    public ngAfterViewInit(): void {
        this.d3Painter = new d3Painter<T>(this.svgRef.nativeElement);
    }


    public setYAxisLines(): void {
        console.log('ChartComponent.setYAxisLines()');
        let areaMinProp = this.prop;
        let areaMaxProp = this.prop;
        if (this.areaMinProp && this.areaMaxProp) {
            areaMinProp = this.areaMinProp;
            areaMaxProp = this.areaMaxProp;
        }
        this.d3Painter.setYAxisLines(this._data, areaMinProp, areaMaxProp, this.unit);
    }

    public setYAxisText(): void {
        console.log('ChartComponent.setYAxisText()');
        let areaMinProp = this.prop;
        let areaMaxProp = this.prop;
        if (this.areaMinProp && this.areaMaxProp) {
            areaMinProp = this.areaMinProp;
            areaMaxProp = this.areaMaxProp;
        }
        this.d3Painter.setYAxisText(this._data, areaMinProp, areaMaxProp, this.unit);
    }

    public setValueScale(): void {
        console.log('ChartComponent.setValueScale()');
        let areaMinProp = this.prop;
        let areaMaxProp = this.prop;
        if (this.areaMinProp && this.areaMaxProp) {
            areaMinProp = this.areaMinProp;
            areaMaxProp = this.areaMaxProp;
        }
        this.d3Painter.setValueScale(this._data, areaMinProp, areaMaxProp);
    }

    public setTimeScale(): void {
        console.log('ChartComponent.setTimeScale()');
        this.d3Painter.setTimeScale(this._data, this.timeProp);
    }

    public clearSvg(): void {
        console.log('ChartComponent.clearSvg()');
        this.d3Painter.clearSvg();
    }

    public resetSvg(): void {
        console.log('ChartComponent.resetSvg()');
        this.d3Painter.resetSvg();
    }


    public addLine(): void {
        console.log('ChartComponent.addLine()');
        this.d3Painter.addLine(this._data, this.prop, this.timeProp);
    }
    public drawLine(): void {
        console.log('ChartComponent.drawLine()');
        this.d3Painter.drawLine(this._data, this.prop, this.timeProp, this.unit);
    }

    public addArea(): void {
        console.log('ChartComponent.addArea()');
        let areaMinProp = this.prop;
        let areaMaxProp = this.prop;
        if (this.areaMinProp && this.areaMaxProp) {
            areaMinProp = this.areaMinProp;
            areaMaxProp = this.areaMaxProp;
        }
        this.d3Painter.addArea(this._data, areaMinProp, areaMaxProp, this.timeProp);
    }
    public drawArea(): void {
        console.log('ChartComponent.drawArea()');
        let areaMinProp = this.prop;
        let areaMaxProp = this.prop;
        if (this.areaMinProp && this.areaMaxProp) {
            areaMinProp = this.areaMinProp;
            areaMaxProp = this.areaMaxProp;
        }
        this.d3Painter.drawArea(this._data, areaMinProp, areaMaxProp, this.timeProp);
    }

    public drawWindrose(): void {
        console.log('ChartComponent.drawWindrose()');
        this.d3Painter.drawWindrose(this._data, this.unit);
    }

}
