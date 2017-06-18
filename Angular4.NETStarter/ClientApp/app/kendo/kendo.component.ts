import { Component, ViewEncapsulation } from '@angular/core';
import { UserInfoDto } from '../model/UserInfoDto'


@Component({
    styleUrls: [
        '../../../node_modules/@progress/kendo-theme-default/dist/all.css'
    ],
    // prevent style encapsulation
    encapsulation: ViewEncapsulation.None,
    templateUrl: 'kendo.component.html'
})



export class KendoComponent {
    title = 'Kendo Demo!';

    public genderItems: Array<string> = ["Male", "Female"];
    public min: number = 18;
    public max: number = 99;
    public smallStep: number = 1;

    public userIndo: UserInfoDto;

    constructor() {
        this.userIndo = new UserInfoDto();
    }

    save(){

    }
} 
