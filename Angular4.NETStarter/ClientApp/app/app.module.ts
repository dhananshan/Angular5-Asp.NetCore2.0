import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { KendoComponent } from './kendo/kendo.component';
import { PageNotFoundComponent } from './pagenotfound/pagenotfound.component';
import { NavComponent } from './navigation/nav.component';

import { RouterModule, Routes } from '@angular/router';


const appRoutes: Routes = [
    { path: 'kendo', component: KendoComponent }
];

@NgModule({
    imports: [BrowserModule, RouterModule.forRoot(appRoutes)],

    declarations: [AppComponent,
        KendoComponent,
        PageNotFoundComponent,
        NavComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }