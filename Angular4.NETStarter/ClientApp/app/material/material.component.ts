import { Component, ViewEncapsulation } from '@angular/core';



@Component({
   
     styleUrls: [
        '../../../node_modules/@angular/material/prebuilt-themes/indigo-pink.css'
    ],
    // prevent style encapsulation
     encapsulation: ViewEncapsulation.None,

     templateUrl: 'material.component.html'
})


export class MaterialComponent {
    title = 'Hello World!';
    public genderItems: [
        { value: 'male', viewValue: 'Male' },
        { value: 'female', viewValue: 'Female' }
    ];


    onButtonClick() {
        this.title = 'Hello from Material UI!';
    }
} 