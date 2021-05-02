
import { ArchiveData, TimeUnit } from '../models/joknuden.models';
import { environment } from './../../environments/environment';

export class TungenesApi {

    private readonly apiUrl: string;

    constructor() {

        let protocol: string = 'https';
        let hostname: string = window.location.hostname;
        let port: number = 80;

        if (environment.production) {
            protocol = 'https';
            hostname = window.location.hostname;
            port = 80;
        }
        else {
            protocol = 'http';
            port = 8080;
            hostname = 'localhost';
        }

        this.apiUrl = `${ protocol }://${ hostname }:${ port }/api`;

        console.log(this);

    }

    private async fetch<T>(path: string, requestInit?: RequestInit): Promise<T> {
        try {
            const fetchResponse = await fetch(path, requestInit);
            if (!fetchResponse.ok) {
                throw new Error(fetchResponse.statusText);
            }
            return await fetchResponse.json();
        }
        catch (error) {
            throw error;
        }
    }

    private get<T>(path: string, signal?: AbortSignal | null): Promise<T> {
        return this.fetch<T>(`${ this.apiUrl }/${ path }`, {
            method: 'GET',
            signal: signal,
        });
    }

    public getArchiveData(timeUnit: TimeUnit, amount: number = 1, signal?: AbortSignal | null): Promise<ArchiveData[]> {
        return this.get(`archive/${ timeUnit }/${ amount > 0 ? amount : '' }`, signal);
    }

}
