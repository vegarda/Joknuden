
import { Component, OnInit, ViewChild } from '@angular/core';
import { ArchiveChartsService } from './archive-charts.service';




@Component({
    selector: 'jok-archive-charts',
    templateUrl: 'archive-charts.component.html',
    styleUrls: ['archive-charts.component.scss'],
})
export class ArchiveChartsComponent implements OnInit {

    constructor(
        private archiveChartsService: ArchiveChartsService,
    ) { }

    public async ngOnInit(): Promise<void> {



    }


}

