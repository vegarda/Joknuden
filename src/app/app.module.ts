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

import { TemperatureChartComponent } from './components/charts/archive-charts/temperature-chart/temperature-chart.component';
import { ChartComponent } from './components/charts/chart/chart.component';
import { ArchiveChartsComponent } from './components/charts/archive-charts/archive-charts.component';
import { ArchiveChartsService } from './components/charts/archive-charts/archive-charts.service';
import { FooterComponent } from './components/footer/footer.component';
import { HiloComponent } from './components/hilo/hilo.component';
import { BarometerChartComponent } from './components/charts/archive-charts/barometer-chart/barometer-chart.component';
import { WindChartsComponent } from './components/charts/wind-charts/wind-charts.component';
import { WindChartsService } from './components/charts/wind-charts/wind-charts.service';
import { HeaderComponent } from './components/header/header.component';
import { FormsModule } from '@angular/forms';


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
        BarometerChartComponent,

        ArchiveChartsComponent,

        WindChartsComponent,

        HeaderComponent,

        FooterComponent,
        HiloComponent,

    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        MaterialModule,
        BrowserAnimationsModule,
    ],
    providers: [

        TungenesApi,

        RoutingService,

        ConsoleService,
        ArchiveChartsService,
        WindChartsService,

    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
