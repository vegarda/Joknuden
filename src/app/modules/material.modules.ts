import { NgModule } from '@angular/core';

import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
    imports: [
        MatMenuModule,
        MatSnackBarModule,
        MatSidenavModule,
        MatTabsModule,
        MatToolbarModule,
        MatButtonModule,
        MatCardModule,
        MatDialogModule,
        MatIconModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatTableModule,
        MatSelectModule,
    ],
    exports: [
        MatMenuModule,
        MatSnackBarModule,
        MatSidenavModule,
        MatTabsModule,
        MatToolbarModule,
        MatButtonModule,
        MatCardModule,
        MatDialogModule,
        MatIconModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatTableModule,
        MatSelectModule,
    ],
})
export class MaterialModule { }
