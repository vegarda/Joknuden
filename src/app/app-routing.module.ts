import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';

export const joknudenRoutes: Routes = [
    {
        path: '',
        component: MainComponent,
    },
    {
        path: `:timeUnit/:amount`,
        component: MainComponent,
    },
    {
        path: `:timeUnit`,
        component: MainComponent,
    },
    {
        path: '**',
        redirectTo: '',
    }
];

@NgModule({
    imports: [RouterModule.forRoot(joknudenRoutes, { enableTracing: false })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
