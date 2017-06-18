import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './pagenotfound/pagenotfound.component';
import { NavComponent } from './navigation/nav.component';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { RequiredValidator } from './validator/CustomValidation/required.validator'
import { ValidationComponent } from './validator/validation.component'

import { KendoComponent } from './kendo/kendo.component';
import { MaterialComponent } from './material/material.component';

// Import the kendo ButtonsModule
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { LabelModule } from '@progress/kendo-angular-label';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule } from '@progress/kendo-angular-inputs';
 
// Import the material ButtonsModule
import { MdButtonModule, MdCheckboxModule } from '@angular/material';

const appRoutes: Routes = [
    { path: 'kendo', component: KendoComponent },
    { path: 'material', component: MaterialComponent }
];

@NgModule({
    imports: [BrowserModule,
        FormsModule,
        BrowserAnimationsModule,
        ButtonsModule, LabelModule, DateInputsModule, DropDownsModule, InputsModule,
        MdButtonModule, MdCheckboxModule,
        RouterModule.forRoot(appRoutes)],

    declarations: [AppComponent,
        KendoComponent,
        MaterialComponent,
        PageNotFoundComponent,
        NavComponent,
        ValidationComponent,
        RequiredValidator],
    bootstrap: [AppComponent]
})
export class AppModule { }