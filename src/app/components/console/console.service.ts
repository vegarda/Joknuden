import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ConsoleData {
    barometer?: number;
    dateTime?: number;
    dayRain?: number;
    heatindex?: number;
    outHumidity?: number;
    outTemp?: number;
    windDir?: number | null;
    windGust?: number;
    windGustDir?: number | null;
    windSpeed?: number;
}

@Injectable({
    providedIn: 'root',
})
export class ConsoleService {

    private static readonly webSocketReconnectTime: number = 1000;
    private static readonly maxWebSocketReconnectTime: number = 30000;

    private webSocketReconnectTime: number = ConsoleService.webSocketReconnectTime;

    private _socket: WebSocket;

    private _data$: BehaviorSubject<ConsoleData> = new BehaviorSubject(null);
    public get data$(): Observable<ConsoleData> {
        return this._data$;
    }
    public get data(): ConsoleData {
        return this._data$.value;
    }

    constructor(
    ) {
        console.log(this);
        this.openWebSocket();
    }

    private async openWebSocket(): Promise<void> {

        console.log('newSocket', this.webSocketReconnectTime);

        this._socket = new WebSocket('ws://localhost:800');

        this._socket.addEventListener('open', (test: any) => {
            this.webSocketReconnectTime = 1000;
        });

        this._socket.addEventListener('error', (error: any) => {
            console.log('socket error', error);
        });

        this._socket.addEventListener('close', (event: CloseEvent) => {
            setTimeout(() => {
                this.openWebSocket();
                this.webSocketReconnectTime = this.webSocketReconnectTime * 2;
                if (this.webSocketReconnectTime > ConsoleService.maxWebSocketReconnectTime) {
                    this.webSocketReconnectTime = ConsoleService.maxWebSocketReconnectTime;
                }
            }, this.webSocketReconnectTime);
        });

        this._socket.addEventListener('message', (message: MessageEvent) => {
            // console.log(message);
            if (message && message.data) {
                const consoleData: ConsoleData = JSON.parse(message.data);
                // console.log(consoleData);
                if (consoleData && consoleData.dateTime) {
                    this._data$.next(consoleData);
                }
            }
        });

}


}
