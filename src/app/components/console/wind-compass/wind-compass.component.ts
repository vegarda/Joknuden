import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    selector: 'jok-wind-compass',
    templateUrl: './wind-compass.component.html',
    styleUrls: ['./wind-compass.component.scss'],
})
export class WindCompassComponent implements OnChanges {

    @Input() public windDir: number = 0;

    public rotateDir: number = 0;

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes.windDir) {
            this.calculateRotateDir(changes.windDir.currentValue, changes.windDir.previousValue || 0);
        }
    }

    private calculateRotateDir(newWindDir: number, oldWindDir: number): void {

        const d1 = newWindDir - oldWindDir;
        const d2 = d1 + 360;
        const d3 = d1 - 360;

        const absD1 = Math.abs(d1);
        const absD2 = Math.abs(d2);
        const absD3 = Math.abs(d3);

        if (absD1 < absD2 && absD1 < absD3) {
            this.rotateDir = this.rotateDir + d1;
        }
        else if (absD2 < absD1 && absD2 < absD3) {
            this.rotateDir = this.rotateDir + d2;
        }
        else if (absD3 < absD1 && absD3 < absD2) {
            this.rotateDir = this.rotateDir + d3;
        }
        else {
            this.rotateDir = newWindDir;
        }

    }

}
