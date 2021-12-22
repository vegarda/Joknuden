import * as d3 from 'd3';
import { KeysOfType } from 'src/app/types/types';

interface Margins {
    top: number;
    left: number;
    right: number;
    bottom: number;
}


export class d3Painter<Datum = unknown> {

    public get width(): number {
        return this.svgElement.clientWidth - this.margins.left - this.margins.right;
    }

    public get height(): number {
        return this.svgElement.clientHeight - this.margins.top - this.margins.bottom;
    }

    private margins = {
        top: 24,
        right: 0,
        bottom: 36,
        left: 0,
    };

    private svg: d3.Selection<SVGSVGElement, Datum, null, never>;

    private mainContainer: d3.Selection<SVGGElement, Datum, null, never>;

    private timeScale: d3.ScaleTime<number, number, never>;
    private valueScale: d3.ScaleLinear<number, number, never>;

    constructor(
        private svgElement: SVGSVGElement,
    ) {
        this.svg = d3.select(this.svgElement);
        this.addMainContainer();
        this.setDimensions();
    }

    private addMainContainer(): this {
        console.log('d3Painter.addMainContainer()');
        if (this.mainContainer) {
            return this;
        }
        const mainContainer = this.svg.append('g');
        mainContainer.attr('class', 'container');
        this.mainContainer = mainContainer;
        return this;
    }

    private setDimensions(): this {
        console.log('d3Painter.setDimensions()');
        const svg = this.svg;
        const width = this.width;
        const height = this.height;
        const margins = this.margins;
        const mainContainer = this.mainContainer;
        mainContainer.attr('transform', 'translate(' + margins.left + ',' + margins.top + ')');
        svg.attr('width', width + margins.left + margins.right);
        svg.attr('height', height + margins.top + margins.bottom);
        svg.attr('viewBox', '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom));
        svg.attr('preserveAspectRatio', 'xMidYMid');
        return this;
    }

    public clearSvg(): this {
        console.log('d3Painter.clearSvg()');
        this.mainContainer = null;
        this.timeScale = null;
        this.valueScale = null;
        this.svg.selectAll('*').remove();
        this.svg.attr('width', null);
        this.svg.attr('height', null);
        this.svg.attr('viewBox', null);
        this.svg.attr('preserveAspectRatio', null);
        return this;
    }

    public resetSvg(): this {
        console.log('d3Painter.resetSvg()');
        this.clearSvg();
        this.addMainContainer();
        this.setDimensions();
        return this;
    }

    public setMargins(margins: Margins): void {
        this.margins = margins;
        this.setDimensions();
    }


    public setTimeScale(
        datum: Datum[],
        timeProp: KeysOfType<Datum, Date>,
    ): this {

        console.log('d3Painter.setTimeScale()');

        if (!timeProp || !Array.isArray(datum) || datum.length === 0) {
            console.warn('timeProp', timeProp);
            console.warn('datum', datum);
            return this;
        }

        const width = this.width;
        const height = this.height;

        const timeScale = d3.scaleTime().range([0, width]);
        this.timeScale = timeScale;
        if (datum.length === 0) {
            return this;
        }

        timeScale.domain([datum[0][timeProp] as any as Date, datum[datum.length - 1][timeProp] as any as Date]);
        const firstDate =  new Date(datum[0][timeProp] as any as Date);
        const secondDate =  new Date(datum[1][timeProp] as any as Date);
        const lastDate =  new Date(datum[datum.length - 1][timeProp] as any as Date);
        const interval = secondDate.getTime() - firstDate.getTime();
        const length = lastDate.getTime() - firstDate.getTime();

        const dateTimeFormatOptions: Intl.DateTimeFormatOptions = {
            timeZone: 'Europe/Oslo',
            // hour12: false,
        };

        const oneHourInMs = 60 * 60 * 1000;
        const oneDayInMs = 24 * oneHourInMs;
        const oneWeekInMs = 7 * oneDayInMs;
        const oneMonthInMs = 4 * oneWeekInMs;

        if (length < 1 * oneDayInMs) {
            dateTimeFormatOptions.hour = '2-digit';
            dateTimeFormatOptions.minute = '2-digit';
        }
        else if (length < 2 * oneDayInMs) {
            dateTimeFormatOptions.month = '2-digit';
            dateTimeFormatOptions.day = '2-digit';
            dateTimeFormatOptions.hour = '2-digit';
            dateTimeFormatOptions.minute = '2-digit';
        }


        const iso8601Locale = 'sv-Se';
        const hour24LocaleIso8601Locale = `${ iso8601Locale }-u-hc-h23`;

        const dateTimeFormat = Intl.DateTimeFormat(hour24LocaleIso8601Locale, dateTimeFormatOptions);
        const xAxisTickFormat = (domainValue: number | Date | { valueOf(): number; }, index: number): string => {
            // console.log(domainValue);
            return dateTimeFormat.format(domainValue as Date);
        }


        let xAxisTimeInterval: d3.AxisTimeInterval;

        const hours = length / oneHourInMs;
        console.log('hours', hours);

        const days = length / oneDayInMs;
        console.log('days', days);

        const weeks = length / oneWeekInMs;
        console.log('weeks', weeks);

        const months = length / oneMonthInMs;
        console.log('months', months);


        if (months >= 4) {
            xAxisTimeInterval = d3.timeMonth.every(1);
        }
        else if (months >= 2) {
            xAxisTimeInterval = d3.timeMonday.every(2);
        }
        else if (weeks >= 2) {
            xAxisTimeInterval = d3.timeMonday.every(1);
        }
        else if (days >= 2) {
            xAxisTimeInterval = d3.timeDay.every(1);
        }
        else if (days >= 1) {
            xAxisTimeInterval = d3.timeHour.every(6);
        }
        else if (hours >= 18) {
            xAxisTimeInterval = d3.timeHour.every(3);
        }
        else if (hours >= 12) {
            xAxisTimeInterval = d3.timeHour.every(2);
        }
        else {
            xAxisTimeInterval = d3.timeHour.every(1);
        }

        const axisBottom = d3.axisBottom(timeScale);
        axisBottom.tickFormat(xAxisTickFormat);
        axisBottom.ticks(xAxisTimeInterval);
        axisBottom.tickSize(0);


        const axisBottomGroup = this.mainContainer.append('g');
        axisBottomGroup.attr('class', 'axis axis-bottom x-axis');
        axisBottomGroup.attr('transform', 'translate(0,' + height + ')');
        axisBottomGroup.call(axisBottom);
        axisBottomGroup.attr('font-size', null);
        axisBottomGroup.attr('font-family', null);

        const axisBottomDomain = axisBottomGroup.selectAll('.domain');
        // axisBottomDomain.attr('style', 'color: transparent');

        const zeroTick = axisBottomGroup.select('[transform="translate(0,0)"]');
        zeroTick.attr('text-anchor', 'start');

        // set axis bottom tick size
        const axisBottomLines = axisBottomGroup.selectAll('line');
        axisBottomLines.attr('y1', '0.5em');
        axisBottomLines.attr('y2', '-0.5em');

        const axisBottomTexts = axisBottomGroup.selectAll('text');
        axisBottomTexts.attr('y', '1em');
        axisBottomTexts.attr('dy', '1em');


        return this;

    }

    public setValueScale(
        datum: Datum[],
        minProp: KeysOfType<Datum, number>,
        maxProp: KeysOfType<Datum, number>,
    ): this {

        console.log('d3Painter.setValueScale()');

        if (!minProp || !minProp || !Array.isArray(datum) || datum.length === 0) {
            console.warn('minProp', minProp);
            console.warn('maxProp', maxProp);
            console.warn('datum', datum);
            return this;
        }

        const height = this.height;

        const valueScale = d3.scaleLinear().range([height, 0]);
        const minValue = Math.floor(d3.min(datum, d => d[minProp] as any as number) - 1);
        const maxValue = Math.ceil(d3.max(datum, d => d[maxProp] as any as number) + 1);
        valueScale.domain([minValue, maxValue]);

        console.log('minValue', minValue);
        console.log('maxValue', maxValue);

        this.valueScale = valueScale;

        return this;

    }

    public setYAxisText(
        datum: Datum[],
        minProp: KeysOfType<Datum, number>,
        maxProp: KeysOfType<Datum, number>,
        unit: string = '',
    ): this {

        console.log('d3Painter.setYAxisText()');

        if (!minProp || !minProp || !Array.isArray(datum) || datum.length === 0) {
            console.warn('minProp', minProp);
            console.warn('maxProp', maxProp);
            console.warn('datum', datum);
            return this;
        }

        const mainContainer = this.mainContainer

        const width = this.width;

        if (!this.valueScale) {
            this.setValueScale(datum, minProp, maxProp);
        }

        const yAxisTickFormat = (domainValue: number | Date | { valueOf(): number; }, index: number) => `${ domainValue } ${ unit }`;

        const axisRight = d3.axisRight(this.valueScale);
        axisRight.tickSize(0);
        axisRight.ticks(6);
        axisRight.tickFormat(yAxisTickFormat);

        // this.axisRight = axisRight;

        const yAxisGroup = mainContainer.append('g');
        yAxisGroup.attr('class', 'axis y-axis axis-text');
        yAxisGroup.attr('transform', 'translate(' + (width) + ', 0)');
        yAxisGroup.call(axisRight);
        yAxisGroup.attr('font-size', null);
        yAxisGroup.attr('font-family', null);
        yAxisGroup.style('shape-rendering', 'crispedges');

        yAxisGroup.select('.domain').remove();

        const yAxisGroupTexts = yAxisGroup.selectAll('text');
        yAxisGroupTexts.attr('x', '-0.25em');
        yAxisGroupTexts.attr('dy', '-0.25em');
        yAxisGroupTexts.attr('text-anchor', 'end');

        const yAxisLines = yAxisGroup.selectAll('line');
        yAxisLines.remove();

        return this;

    }


    public setYAxisLines(
        datum: Datum[],
        minProp: KeysOfType<Datum, number>,
        maxProp: KeysOfType<Datum, number>,
        unit: string = '',
    ): this {

        console.log('d3Painter.setYAxisLines()');

        if (!minProp || !minProp || !Array.isArray(datum) || datum.length === 0) {
            console.warn('minProp', minProp);
            console.warn('maxProp', maxProp);
            console.warn('datum', datum);
            return this;
        }

        if (!this.valueScale) {
            this.setValueScale(datum, minProp, maxProp);
        }

        // if (!this.axisRight) {
        //     this.setAxisRight(datum, minProp, maxProp, unit);
        // }

        const mainContainer = this.mainContainer
        const width = this.width;

        const axisRight = d3.axisRight(this.valueScale);
        axisRight.tickSize(0);
        axisRight.ticks(6);

        const yAxisLinesGroup = mainContainer.append('g');
        yAxisLinesGroup.attr('class', 'axis y-axis');
        yAxisLinesGroup.attr('transform', 'translate(' + (width) + ', 0)');
        yAxisLinesGroup.call(axisRight);
        yAxisLinesGroup.attr('font-size', null);
        yAxisLinesGroup.attr('font-family', null);
        yAxisLinesGroup.style('shape-rendering', 'crispedges');

        yAxisLinesGroup.select('.domain').remove();

        const yAxisGroupTexts = yAxisLinesGroup.selectAll('text');
        yAxisGroupTexts.remove();

        const yAxisLines = yAxisLinesGroup.selectAll('line');
        yAxisLines.attr('x1', -width);

        return this;

    }

    public addLine(
        datum: Datum[],
        prop: KeysOfType<Datum, number>,
        timeProp: KeysOfType<Datum, Date>,
    ): this {

        console.log('d3Painter.addLine()');

        if (!prop || !timeProp || !Array.isArray(datum) || datum.length === 0) {
            console.warn('prop', prop);
            console.warn('timeProp', timeProp);
            console.warn('datum', datum);
            return this;
        }

        if (!this.timeScale) {
            this.setTimeScale(datum, timeProp);
        }

        if (!this.valueScale) {
            this.setValueScale(datum, prop, prop);
        }

        const line = d3.line<any>();
        line.curve(d3.curveCatmullRom);
        line.x(d => this.timeScale(d[timeProp]));
        line.y(d => {
            // console.log(d[prop], this.valueScale(d[prop]))
            return this.valueScale(d[prop]);
        });

        const mainContainer = this.mainContainer;
        const graphGroup = mainContainer.append('g');
        graphGroup.attr('class', 'graph line');

        const path = graphGroup.append('path').datum(datum);
        path.attr('d', line)
        path.attr('class', 'line');

        return this;

    }

    public drawLine(
        datum: Datum[],
        prop: KeysOfType<Datum, number>,
        timeProp: KeysOfType<Datum, Date>,
        unit: string = '',
    ): this {

        console.log('d3Painter.drawLine()');

        if (!prop || !timeProp || !Array.isArray(datum) || datum.length === 0) {
            console.warn('prop', prop);
            console.warn('timeProp', timeProp);
            console.warn('datum', datum);
            return this;
        }

        this.setYAxisLines(datum, prop, prop);
        this.addLine(datum, prop, timeProp);
        this.setYAxisText(datum, prop, prop, unit);

        return this;

    }




    public addArea(
        datum: Datum[],
        minProp: KeysOfType<Datum,number>,
        maxProp: KeysOfType<Datum, number>,
        timeProp: KeysOfType<Datum, Date>,
    ): this {

        console.log('d3Painter.drawArea()');

        if (!minProp || !minProp || !timeProp || !Array.isArray(datum) || datum.length === 0) {
            console.warn('timeProp', timeProp);
            console.warn('minProp', minProp);
            console.warn('maxProp', maxProp);
            console.warn('datum', datum);
            return this;
        }

        if (!this.timeScale) {
            this.setTimeScale(datum, timeProp);
        }

        if (!this.valueScale) {
            this.setValueScale(datum, minProp, maxProp);
        }

        const area = d3.area<Datum>();
        area.curve(d3.curveCatmullRom);
        area.x(d => this.timeScale(d[timeProp] as any as number));
        area.y0(d => this.valueScale(d[minProp] as any as number));
        area.y1(d => this.valueScale(d[maxProp] as any as number));

        const mainContainer = this.mainContainer;
        const graphGroup = mainContainer.append('g');
        graphGroup.attr('class', 'graph area');

        const path = graphGroup.append('path').datum(datum);
        path.attr('d', area);
        path.attr('class', 'area');

        return this;

    }

    public drawArea(
        datum: Datum[],
        minProp: KeysOfType<Datum,number>,
        maxProp: KeysOfType<Datum, number>,
        timeProp: KeysOfType<Datum, Date>,
    ): this {

        console.log('d3Painter.drawArea()');

        if (!minProp || !minProp || !timeProp || !Array.isArray(datum) || datum.length === 0) {
            console.warn('timeProp', timeProp);
            console.warn('minProp', minProp);
            console.warn('maxProp', maxProp);
            console.warn('datum', datum);
            return this;
        }

        if (!this.timeScale) {
            this.setTimeScale(datum, timeProp);
        }

        if (!this.valueScale) {
            this.setValueScale(datum, minProp, maxProp);
        }
        // if (!this.axisRight) {
        //     this.setAxisRight(datum, minProp, maxProp, unit);
        // }

        this.addArea(datum, minProp, maxProp, timeProp);

        return this;

    }





    public drawWindrose(
        datum: Datum[],
        unit: string = '',
    ): this {

        console.log('d3Painter.drawWindrose()');
        console.log('datum', datum);
        console.log('unit', unit);



        const svg = this.svg;
        const width = this.svgElement.clientWidth;
        const height = this.svgElement.clientHeight;

        console.log('width', width);
        console.log('height', height);

        const margins = {
            top: 24,
            left: 24,
            right: 24,
            bottom: 24,
        }

        const innerRadius = 0;
        const outerRadius = Math.min(width - margins.left - margins.right, height - margins.top - margins.bottom) / 2;
        // const outerRadius = Math.min(width, height) / 2;

        console.log('outerRadius', outerRadius);



        const windroseGroup = svg.append('g');
        windroseGroup.attr('class', 'windrose-group');
        // windroseGroup.attr('transform', `translate(${ (width / 2) - (margins.left / 2) }, ${ (height / 2) + (margins.top / 1) })`);
        windroseGroup.attr('transform', `translate(${ (width / 2) }, ${ (height / 2) })`);


        const yAxisValueRange = d3.scaleLinear().range([innerRadius, outerRadius]);
        yAxisValueRange.domain([0, d3.max(datum as any as number[])]);




        const windPrincipalGroup = windroseGroup.append('g');
        windPrincipalGroup.attr('class', 'windPrincipalGroup');

        const windPrincipalGroups = windPrincipalGroup.selectAll('g').data(datum).enter().append('g');
        windPrincipalGroups.attr('class', 'windPrincipalGroups');
        windPrincipalGroups.attr('text-anchor', 'middle');
        windPrincipalGroups.attr('transform', (d, i) => `rotate(${ (i * 360 / 16) - 90 }), translate(${ (outerRadius + margins.top / 2) }, 0)`);

        const windPrincipals = [
            'N', 'NNØ', 'NØ', 'ØNØ',
            'Ø', 'ØSØ', 'SØ', 'SSØ',
            'S', 'SSV', 'SV', 'VSV',
            'V', 'VNV', 'NV', 'NNV'
        ];

        const windPrincipaltexts = windPrincipalGroups.append('text');
        windPrincipaltexts.attr('transform', (d, i) => 'rotate(' + (90 + (i > 3 && i < 12 ? 180 : 0)) + ')');
        windPrincipaltexts.attr('dominant-baseline', 'middle');
        windPrincipaltexts.attr('fill', 'currentColor');
        windPrincipaltexts.text((d, i) => windPrincipals[i]);
        // windPrincipaltexts.style('font-size', 14);














        const yAxisGroup = windroseGroup.append('g');
        yAxisGroup.attr('class', 'yAxisGroup');
        yAxisGroup.attr('class', 'axis y-axis')
        yAxisGroup.attr('text-anchor', 'middle')

        const yAxisTickGroups = yAxisGroup.selectAll('g').data(yAxisValueRange.ticks(3).slice(1)).enter().append('g');
        yAxisTickGroups.attr('class', 'yAxisTickGroups');

        const yAxisTickGroupCircles = yAxisTickGroups.append('circle');
        yAxisTickGroupCircles.attr('class', 'yAxisTickGroupCircles');
        yAxisTickGroupCircles.attr('fill', 'none');
        yAxisTickGroupCircles.attr('stroke', 'gray');
        yAxisTickGroupCircles.attr('stroke-dasharray', '4, 4');
        yAxisTickGroupCircles.attr('r', yAxisValueRange);




        const arcsGroup = windroseGroup.append('g');
        arcsGroup.attr('class', 'arc-group');
        arcsGroup.attr('transform', `rotate(${ -360 / 32 })`);

        const arcPaths = arcsGroup.selectAll('path').data(datum).enter().append('path');
        arcPaths.attr('class', 'arc');
        const arc = d3.arc<any>();
        // d3.arc<any>()
        arc.innerRadius(d => 0);
        arc.outerRadius((d, i, j) => yAxisValueRange(d));
        arc.startAngle((d, i) => ((i * 2 * Math.PI) / 16));
        arc.endAngle((d, i) => (((i + 1) * 2 * Math.PI) / 16));
        // arc.padAngle(Math.PI / 32);
        // arc.padAngle(Math.PI / 64);
        arc.padAngle(Math.PI / 128);
        // arc.padAngle(Math.PI / 256);

        arcPaths.attr('d', arc);



        const yAxisGroup2 = windroseGroup.append('g');
        yAxisGroup2.attr('class', 'yAxisGroup');
        yAxisGroup2.attr('class', 'axis y-axis')
        yAxisGroup2.attr('text-anchor', 'middle')

        const yAxisTickGroups2 = yAxisGroup2.selectAll('g').data(yAxisValueRange.ticks(3).slice(1)).enter().append('g');
        yAxisTickGroups2.attr('class', 'yAxisTickGroups');

        const yAxisTickGroupTexts2 = yAxisTickGroups2.append('text');
        yAxisTickGroupTexts2.attr('y', d => -yAxisValueRange(d));
        yAxisTickGroupTexts2.attr('fill', 'currentColor');
        // .attr('dy', '-0.35em')
        // .attr('x', d => -10)
        yAxisTickGroupTexts2.text(d => `${ d } ${ unit }`);
        // yAxisTickGroupTexts.style('font-size', 14);




        return this;

    }

}





