import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { KeysOfType } from 'src/app/types/types';
import { d3Painter } from './d3-painter';


@Component({
    selector: 'jok-chart',
    template: `<svg #svgRef></svg>`,
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

    private _data: T[] = [];
    @Input() public set data(data: T[]) {
        if (Array.isArray(data)) {
            this._data = data;
        }
        else {
            this._data = [];
        }
        this.drawChart();
    }

    private d3Painter: d3Painter<T>;

    constructor(
        private elementRef: ElementRef<HTMLElement>,
    ) { }

    public ngOnInit(): void {
        console.log(this)
    }


    public ngAfterViewInit(): void {

        this.d3Painter  = new d3Painter<T>(this.svgRef.nativeElement);
        this.drawChart();

    }


    private drawChart() {
        console.log('ChartComponent.drawChart()');
        if (this.d3Painter) {
            this.d3Painter.clearSvg();
            this.d3Painter.drawArea(this._data, this.areaMinProp, this.areaMaxProp, this.timeProp, this.unit);
            this.d3Painter.drawLine(this._data, this.prop, this.timeProp, this.unit);
        }

    }

    public clear() {
        console.log('ChartComponent.clear()');
        if (this.d3Painter) {
            this.d3Painter.clearSvg();
        }
    }

    public drawArea() {
        console.log('ChartComponent.drawArea()');
        if (this.d3Painter) {
            this.d3Painter.drawArea(this._data, this.areaMinProp, this.areaMaxProp, this.timeProp, this.unit);
        }
    }

    public drawLine() {
        console.log('ChartComponent.drawLine()');
        if (this.d3Painter) {
            this.d3Painter.drawLine(this._data, this.prop, this.timeProp, this.unit);
        }
    }

    public drawWindrose() {
        console.log('ChartComponent.drawWindrose()');
        if (this.d3Painter) {
            this.d3Painter.drawWindrose(this._data, this.unit);
        }
    }


}
