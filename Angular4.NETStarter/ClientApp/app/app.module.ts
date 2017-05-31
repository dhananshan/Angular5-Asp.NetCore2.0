import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './pagenotfound/pagenotfound.component';
import { NavComponent } from './navigation/nav.component';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Import the ButtonsModule
import { KendoComponent } from './kendo/kendo.component';
import { ButtonsModule } from '@progress/kendo-angular-buttons';


const appRoutes: Routes = [
    { path: 'kendo', component: KendoComponent }
];

@NgModule({
    imports: [BrowserModule,
        FormsModule,
        BrowserAnimationsModule,
        ButtonsModule,
        RouterModule.forRoot(appRoutes)],

    declarations: [AppComponent,
        KendoComponent,
        PageNotFoundComponent,
        NavComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }