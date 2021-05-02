import { Component, ViewChild } from '@angular/core';


@Component({
    selector: 'jok-chart',
    template: `<svg #svgRef></svg>`,
})
export class ChartComponent {

    @ViewChild('svgRef', { static: true }) private svgRef: SVGElement;


}
