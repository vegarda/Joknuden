import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main.component';
import { MaterialModule } from './modules/material.modules';

import { RoutingService } from './services/routing.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConsoleComponent } from './components/console/console.component';
import { ConsoleService } from './components/console/console.service';
import { NumberFormatPipe } from './pipes/number-format.pipe';
import { WindCompassComponent } from './components/console/wind-compass/wind-compass.component';
import { WindInfoComponent } from './components/console/wind-info/wind-info.component';
import { TungenesApi } from './api/tungenes-api';

import { TemperatureChartComponent } from './components/charts/archive-charts/temperature-chart.component';
import { ChartComponent } from './components/charts/chart.component';
import { ArchiveChartsComponent } from './components/charts/archive-charts/archive-charts.component';
import { ArchiveChartsService } from './components/charts/archive-charts/archive-charts.service';


@NgModule({
    declarations: [
        AppComponent,
        MainComponent,

        NumberFormatPipe,

        ConsoleComponent,
        WindCompassComponent,
        WindInfoComponent,

        ChartComponent,
        TemperatureChartComponent,
        ArchiveChartsComponent,

    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        MaterialModule,
        BrowserAnimationsModule,
    ],
    providers: [

        TungenesApi,

        RoutingService,

        ConsoleService,
        ArchiveChartsService,

    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
