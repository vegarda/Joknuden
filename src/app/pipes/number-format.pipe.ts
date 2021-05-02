import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'numberFormat',
})
export class NumberFormatPipe implements PipeTransform {

    public transform(value: number, numberFormatOptions: Intl.NumberFormatOptions): string {
        const locale: string = window.navigator.language;
        const numberFormat: Intl.NumberFormat = new Intl.NumberFormat(locale, numberFormatOptions);
        return numberFormat.format(value);
    }

}
