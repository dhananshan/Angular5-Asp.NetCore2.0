import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SecureComponent } from './_layout/secure/secure.component';
import { PublicComponent } from './_layout/public/public.component';
import { AppComponent } from './_layout/app/app.component';


import { LoginComponent } from './_component/login/login.component';
import { HomeComponent } from './_component/home/home.component';
import { AuthGuard } from './_guard/auth.guard'

import { AppRoutingModule } from './app-routing.module';
import { SecureRoutes } from './_layout/secure/secure.routes';
import { PublicRoutes } from './_layout/public/public.routes';


import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// UI Components
import { MatProgressBarModule, MatSnackBarModule, MatExpansionModule, MatSidenavModule, MatToolbarModule, MatButtonModule} from '@angular/material';



// Kendo UI Components




@NgModule({
    imports: [BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatProgressBarModule,
        MatSnackBarModule,
        MatExpansionModule,
        MatSidenavModule,
        MatToolbarModule,
        MatButtonModule],

    declarations: [AppComponent,
        LoginComponent,
        PublicComponent,
        HomeComponent,
        SecureComponent],
    providers: [
        AuthGuard
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }