
import { takeUntil } from 'rxjs/operators';
import { ArchiveData, TimeUnit } from '../models/joknuden.models';
import { AbortablePromise, RequestPromise } from '../utils/promise';
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

    private fetch<T>(path: string, requestInit: RequestInit = {}): AbortablePromise<T> {
        if (requestInit.signal) {
            throw new Error('requestInit.signal');
        }
        const abortController = new AbortController();
        const requestPromise = new RequestPromise<T>(async (resolve, reject) => {
            try {
                const _requestInit = Object.assign({}, requestInit);
                _requestInit.signal = abortController.signal;
                const fetchResponse = await fetch(path, _requestInit);
                if (!fetchResponse.ok) {
                    reject(new Error(fetchResponse.statusText));
                }
                const data = await fetchResponse.json();
                resolve(data);
            }
            catch (error) {
                throw error;
            }
        });
        console.log('requestPromise', requestPromise);
        requestPromise.onAbort$.subscribe(() => abortController.abort());
        return requestPromise;
    }

    private get<T>(path: string): AbortablePromise<T> {
        return this.fetch<T>(`${ this.apiUrl }/${ path }`, {
            method: 'GET',
        });
    }




    public getArchiveData(timeUnit: TimeUnit, amount: number = 1): AbortablePromise<ArchiveData[]> {
        return this.get(`archive/${ timeUnit }/${ amount > 0 ? amount : '' }`);
    }

}
