import { Component, ViewChild, Inject} from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';


@Component({
    templateUrl: './secure.component.html',
    styleUrls: ['./secure.component.css'],

})



export class SecureComponent {



    constructor(private _router: Router) {
    }

   
    
}