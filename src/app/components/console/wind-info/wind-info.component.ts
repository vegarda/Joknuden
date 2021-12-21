
import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewRef, Input } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Language, LanguageService } from 'src/app/services/language.service';
import { ConsoleData } from '../console.service';


@Component({
    selector: 'jok-wind-info',
    templateUrl: './wind-info.component.html',
    styleUrls: ['./wind-info.component.scss'],
})
export class WindInfoComponent {

    public Number = Number;


    @Input() consoleData: ConsoleData;


    private fromString: string;

    public get language(): Language {
        return this.languageService.language;
    }

    private languages = window.navigator.languages;
    public intl: Intl.NumberFormat = new Intl.NumberFormat(this.languages[0], { maximumFractionDigits: 1 });


    private beaufort = {
        description: {
            [Language.Norwegian]: [
                'Stille',
                'Flau vind',
                'Svak vind',
                'Lett bris',
                'Laber bris',
                'Frisk bris',
                'Liten kuling',
                'Stiv kuling',
                'Sterk kuling',
                'Liten storm',
                'Full storm',
                'Sterk storm',
                'Orkan'
            ],
            [Language.English]: [
                'Calm',
                'Light air',
                'Light breeze',
                'Gentle breeze',
                'Moderate breeze',
                'Fresh breeze',
                'Strong breeze',

                // 'High wind',
                // 'Moderate gale',
                'Near gale',

                // 'Fresh gale',
                'Gale',

                // 'Severe gale',
                'Strong gale',

                // 'Whole gale',
                'Storm',

                'Violent storm',
                'Hurricane'
            ]
        },
        windSpeed: [0.2, 1.5, 3.3, 5.5, 8, 10.8, 13.9, 17.2, 20.8, 24.5, 28.5, 32.6, 100]
    };

    private windPrincipals = {
        abbr: {
            [Language.English]: [
                'N', 'NNE', 'NE', 'ENE',
                'E', 'ESE', 'SE', 'SSE',
                'S', 'SSW', 'SW', 'WSW',
                'W', 'WNW', 'NW', 'NNW'
            ],
            [Language.Norwegian]: [
                'N', 'NNØ', 'NØ', 'ØNØ',
                'Ø', 'ØSØ', 'SØ', 'SSØ',
                'S', 'SSV', 'SV', 'VSV',
                'V', 'VNV', 'NV', 'NNV'
            ]
        },
        long: {
            [Language.English]: [
                'north', 'north-northeast', 'northeast', 'east-northeast',
                'east',    'east-southeast',    'southeast', 'south-southeast',
                'south', 'south-southwest', 'southwest', 'west-southwest',
                'west',    'west-northwest',    'northwest', 'north-northwest'
            ],
            [Language.Norwegian]: [
                'nord', 'nord-nordøst',    'nordøst',    'øst-nordøst',
                'øst',    'øst-sørøst',        'sørøst',     'sør-sørøst',
                'sør',    'sør-sørvest',     'sørvest',    'vest-sørvest',
                'vest', 'vest-nordvest', 'nordvest', 'nord-nordvest'
            ]
        }
    };

    constructor(
        private languageService: LanguageService,
    ) {

        console.log('window.navigator.languages', window.navigator.languages);
        console.log('window.navigator.language', window.navigator.language);

        switch (this.language) {
            default:
            case Language.English: {
                this.fromString = 'from';
                break;
            }
            case Language.Norwegian: {
                this.fromString = 'fra';
                break;
            }
        }

        // const language = window.navigator.languages.find(l => this.supportedLanguages.indexOf(l) >= 0);
        // if (language) {
        //         this.language = language;
        // }
        // if (this.language !== 'no') {
        //         this.fromString = 'from';
        // }
    }

    // public render() {

    //         return (
    //                 <div className={`${styles['wind-info-container']} ${consoleStyles['console-column']}`}>
    //                         <span className={styles['beaufort']}>{ this.getBeaufort() }</span>
    //                         <span className={styles['direction']}>{ this.getDirection() } ({ this.props.consoleData.windDir } °)</span>
    //                         <div className={`${styles['wind-speed']} ${consoleStyles['data-row']}`}>
    //                                 <i className={`${weatherIconStyles['wi']} ${weatherIconStyles['wi-strong-wind']}`} />
    //                                 <span className={consoleStyles['data-value']}>{ this.intl.format(this.props.consoleData.windSpeed) }</span>
    //                                 <span className={consoleStyles['data-unit']}>mps</span>
    //                         </div>
    //                         { this.getGustingElement() }
    //                 </div>
    //         )
    // }

    // private getGustingElement() {
    //         if (this.props.consoleData.windGust > this.props.consoleData.windSpeed) {
    //                 return (
    //                         <div className={`${styles['wind-gust']} ${consoleStyles['data-row']}`}>
    //                                 <i className={weatherIconStyles['wi']} />
    //                                 <span className={consoleStyles['data-value']}>({ this.intl.format(this.props.consoleData.windGust) })</span>
    //                                 <span className={consoleStyles['data-unit']} />
    //                         </div>
    //                 )
    //         }
    //         return (
    //                 <div className={`${styles['wind-gust']} ${consoleStyles['data-row']}`} />
    //         )
    // }

    public getBeaufort(): string {
        const beaufortIndex = this.beaufort.windSpeed.findIndex(windSpeed => this.consoleData.windSpeed < windSpeed)
        return this.beaufort.description[this.language][beaufortIndex - 1];
    }

    public getDirection(): string {
        let i = Math.floor((this.consoleData.windDir + 11.25) / 22.5);
        if (i > 15) {
            i = 0;
        }
        return this.fromString + ' ' + this.windPrincipals.long[this.language][i];
    }
}
