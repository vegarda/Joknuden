
import { Component, OnInit, ViewChild } from '@angular/core';
import { TungenesApi } from 'src/app/api/tungenes-api';
import { TimeUnit } from 'src/app/models/joknuden.models';
import { ArchiveChartsService } from './archive-charts.service';




@Component({
    selector: 'jok-archive-charts',
    templateUrl: 'archive-charts.component.html',
})
export class ArchiveChartsComponent implements OnInit {

    constructor(
        private archiveChartsService: ArchiveChartsService,

    ) { }

    public async ngOnInit(): Promise<void> {



    }


}

