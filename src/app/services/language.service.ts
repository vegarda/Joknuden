import { Injectable } from '@angular/core';


export enum Language {
    Norwegian = 'no',
    English = 'en',
}


@Injectable({
    providedIn: 'root',
})
export class LanguageService {

    private _language: Language = Language.English
    public get language(): Language {
        return this._language;
    }

    constructor(
    ) {
        console.log('window.navigator.languages', window.navigator.languages);
        console.log('window.navigator.language', window.navigator.language);
        // const language = window.navigator.languages.find(l => this.supportedLanguages.indexOf(l) >= 0);
        // if (language) {
        //         this.language = language;
        // }
        // if (this.language !== 'no') {
        //         this.fromString = 'from';
        // }
    }

}
