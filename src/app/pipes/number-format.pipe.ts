import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'numberFormat',
})
export class NumberFormatPipe implements PipeTransform {

    public transform(value: number, numberFormatOptions: Intl.NumberFormatOptions = { minimumFractionDigits: 1, maximumFractionDigits: 1, }): string {
        const languages = window.navigator.languages.slice();
        const numberFormat: Intl.NumberFormat = new Intl.NumberFormat(languages, numberFormatOptions);
        return numberFormat.format(value);
    }

}
