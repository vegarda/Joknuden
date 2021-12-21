import * as d3 from 'd3';
import { KeysOfType } from 'src/app/types/types';


export class d3Painter<Datum = unknown> {

    public get width(): number {
        return this.svgElement.clientWidth - this.margins.left - this.margins.right;
    }

    public get height(): number {
        return this.svgElement.clientHeight - this.margins.top - this.margins.bottom;
    }

    public readonly margins = {
        top: 12,
        right: 84,
        bottom: 36,
        left: 36,
    }

    private svg: d3.Selection<SVGSVGElement, Datum, null, never>;
    private mainContainer: d3.Selection<SVGGElement, Datum, null, never>;
    private xAxisTimeRange: d3.ScaleTime<number, number, never>;

    constructor(
        private svgElement: SVGSVGElement,
    ) {
        this.svg = d3.select(this.svgElement);
    }

    public clearSvg(): this {
        console.log('d3Painter.clearSvg()');
        if (!this.svg) {
            return this;
        }
        this.svg.selectAll('*').remove();
        this.mainContainer = null;
        this.svg.attr('width', null);
        this.svg.attr('height', null);
        this.svg.attr('viewBox', null);
        this.svg.attr('preserveAspectRatio', null);
        this.setSvgMargins();
        return this;
    }

    protected addMainContainer(): this {
        console.log('d3Painter.addMainContainer()');
        // if (this.mainContainer) {
        //     return this;
        // }
        const svg = this.svg;
        if (!svg) {
            return this;
        }
        const mainContainer = svg.append('g');
        mainContainer.attr('class', 'container');
        const margin =  this.margins;
        mainContainer.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
        this.mainContainer = mainContainer;
        return this;
    }

    protected setSvgMargins(): this {
        console.log('d3Painter.setSvgMargins()');
        const svg = this.svg;
        if (!svg) {
            return this;
        }
        const width = this.width;
        const height = this.height;
        const margins = this.margins;
        svg.attr('width', width + margins.left + margins.right);
        svg.attr('height', height + margins.top + margins.bottom);
        svg.attr('viewBox', '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom));
        svg.attr('preserveAspectRatio', 'xMidYMid');

        return this;

    }

    public resetSvg(): this {
        console.log('d3Painter.resetSvg()');
        this.clearSvg();
        this.setSvgMargins();
        this.addMainContainer();
        return this;
    }

    private prepareSvg(): void {
        console.log('d3Painter.prepareSvg()');
        if (!this.mainContainer) {
            this.resetSvg();
        }
    }




    public setTime(
        datum: Iterable<Datum>,
        timeProp: KeysOfType<Datum, Date>,
    ): this {

        console.log('d3Painter.setTime()');
        console.log('datum', datum);
        console.log('timeProp', timeProp);

        this.prepareSvg();

        const array = Array.from(datum);

        const width = this.width;
        const height = this.height;

        const xAxisTimeRange = d3.scaleTime().range([0, width]);
        this.xAxisTimeRange = xAxisTimeRange;
        if (array.length === 0) {
            return this;
        }

        xAxisTimeRange.domain([array[0][timeProp] as any as Date, array[array.length - 1][timeProp] as any as Date]);
        const firstDate =  new Date(array[0][timeProp] as any as Date);
        const secondDate =  new Date(array[1][timeProp] as any as Date);
        const lastDate =  new Date(array[array.length - 1][timeProp] as any as Date);
        const interval = secondDate.getTime() - firstDate.getTime();
        const length = lastDate.getTime() - firstDate.getTime();

        const dateTimeFormatOptions: Intl.DateTimeFormatOptions = {
            timeZone: 'Europe/Oslo',
            // hour12: false,
        };

        const oneHourInMs = 60 * 60 * 1000;
        const oneDayInMs = 24 * oneHourInMs;
        const oneWeekInMs = 7 * oneDayInMs;
        const oneMonthInMs = 31 * oneWeekInMs;

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

        const dateTimeFormat = Intl.DateTimeFormat(iso8601Locale, dateTimeFormatOptions);
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


        if (months >= 6) {
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

        const axisBottom = d3.axisBottom(xAxisTimeRange);
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

        const axisBottomTickGroups = axisBottomGroup.selectAll('.tick');
        axisBottomTickGroups.attr('class', 'tick-group');

        // set axis bottom tick size
        const axisBottomLines = axisBottomGroup.selectAll('line');
        axisBottomLines.attr('y1', '0.5em');
        axisBottomLines.attr('y2', '-0.5em');

        const axisBottomTexts = axisBottomGroup.selectAll('text');
        axisBottomTexts.attr('y', '1em');
        axisBottomTexts.attr('dy', '1em');


        return this;

    }

    public drawLine(
        datum: Iterable<Datum>,
        prop: KeysOfType<Datum, number>,
        timeProp: KeysOfType<Datum, Date>,
        unit: string = '',
    ): this {

        console.log('d3Painter.drawLine()');

        console.log('datum', datum);
        console.log('prop', prop);
        console.log('timeProp', timeProp);
        console.log('unit', unit);

        if (!prop || !timeProp) {
            return this;
        }


        this.prepareSvg();
        this.setTime(datum, timeProp);

        const mainContainer = this.mainContainer


        const array = Array.from(datum);

        const width = this.width;
        const height = this.height;


        const yAxisValueRange = d3.scaleLinear().range([height, 0]);
        const minValue = Math.floor(d3.min(array, d => d[prop] as any as number) - 1);
        const maxValue = Math.ceil(d3.max(datum, d => d[prop] as any as number) + 1);
        yAxisValueRange.domain([minValue, maxValue]);


        const yAxisTickFormat = (domainValue: number | Date | { valueOf(): number; }, index: number) => `${ domainValue } ${ unit }`;

        const _yAxis = d3.axisRight(yAxisValueRange);
        _yAxis.tickSize(0);
        _yAxis.ticks(6);
        _yAxis.tickFormat(yAxisTickFormat);

        const yAxisGroup = mainContainer.append('g');
        yAxisGroup.attr('class', 'axis y-axis');
        yAxisGroup.attr('transform', 'translate(' + (width) + ', 0)');
        yAxisGroup.call(_yAxis);
        yAxisGroup.attr('font-size', null);
        yAxisGroup.attr('font-family', null);
        yAxisGroup.style('shape-rendering', 'crispedges')

        const yAxisGroupTicks = yAxisGroup.selectAll('.tick');
        yAxisGroupTicks.attr('class', 'tick-group');

        const yAxisGroupTexts = yAxisGroup.selectAll('text');
        yAxisGroupTexts.attr('x', '1em');
        // yAxisGroupTexts.attr('dy', '0.5em');

        // set y-axis tick size/width
        const yAxisLines = yAxisGroup.selectAll('line');
        yAxisLines.attr('x1', -width);
        yAxisLines.attr('x2', '0.5em');




        const outTempLine = d3.line<any>();
        outTempLine.curve(d3.curveCatmullRom);
        outTempLine.x(d => {
            // console.log(d);
            // console.log(xAxisTimeRange(d[this.timeProp]));
            return this.xAxisTimeRange(d[timeProp]);
        });
        outTempLine.y(d => {
            // console.log(d);
            // console.log(yAxisValueRange(d.outTemp));
            return yAxisValueRange(d[prop]);
        });

        const graphGroup = mainContainer.append('g');
        graphGroup.attr('class', 'graph line');

        graphGroup.append('path')
            .datum(array)
            .attr('d', outTempLine)
            .attr('class', 'line');


            return this;


    }





    public drawArea(
        datum: Iterable<Datum>,
        minProp: KeysOfType<Datum,number>,
        maxProp: KeysOfType<Datum, number>,
        timeProp: KeysOfType<Datum, Date>,
        unit: string = '',
    ): this {


        console.log('d3Painter.drawArea()');

        console.log('datum', datum);
        console.log('minProp', minProp);
        console.log('maxProp', maxProp);
        console.log('timeProp', timeProp);
        console.log('unit', unit);

        if (!minProp || !maxProp) {
            console.warn('!minProp || !maxProp');
            return this;
        }

        this.prepareSvg();
        this.setTime(datum, timeProp);


        const width = this.width;
        const height = this.height;

        const mainContainer = this.mainContainer;

        const array = Array.from(datum);


        const yAxisValueRange = d3.scaleLinear().range([height, 0]);
        const minValue = Math.floor(d3.min(array, d => d[minProp] as any as number) - 1);
        const maxValue = Math.ceil(d3.max(array, d => d[maxProp] as any as number) + 1);
        yAxisValueRange.domain([minValue, maxValue]);


        const outTempArea = d3.area<Datum>();
        outTempArea.curve(d3.curveCatmullRom);
        outTempArea.x(d => this.xAxisTimeRange(d[timeProp] as any as number));
        outTempArea.y0(d => yAxisValueRange(d[minProp] as any as number));
        outTempArea.y1(d => yAxisValueRange(d[maxProp] as any as number));



        const graphGroup = mainContainer.append('g');
        graphGroup.attr('class', 'graph area');

        const linearGradient = graphGroup.append('linearGradient');
        linearGradient.attr('id', 'outTempAreaGradient');
        linearGradient.attr('gradientUnits', 'userSpaceOnUse');
        linearGradient.attr('x1', 0).attr('y1', yAxisValueRange(-15));
        linearGradient.attr('x2', 0).attr('y2', yAxisValueRange(25));

        const gradientStops = [
            { offset: '0%', color: '#2222ffdd' },
            { offset: '18.75%', color: '#2222ffaa' },
            { offset: '37.5%', color: '#cccccccc' },
            { offset: '56.25%', color: '#ff2222aa' },
            { offset: '100%', color: '#ff2222dd' },
        ];

        gradientStops.forEach(gradientStops => {
            const stop = linearGradient.append('stop');
            stop.attr('offset', gradientStops.offset);
            stop.attr('stop-color', gradientStops.color);
        });

        graphGroup.append('path')
            .datum(datum)
            .attr('d', outTempArea)
            // .style('fill', 'url(#outTempAreaGradient)')
            .attr('class', 'area');


        return this;

    }





    public drawWindrose(
        datum: Iterable<Datum>,
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
            top: 50,
            left: 24,
            right: 24,
            bottom: 48,
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
        yAxisValueRange.domain([0, d3.max(datum as number[])]);




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





