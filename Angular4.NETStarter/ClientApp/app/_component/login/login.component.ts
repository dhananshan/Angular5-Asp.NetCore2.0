
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';


@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent {

    model: any = {};
    private isDisabled = false;

    constructor(
        private _router: Router) {
    }
 
    login(value: any) {
        this.isDisabled = true;

        //validate username & password
        setTimeout(() => { this._router.navigate(['/home']); }, 2000);
    }
}
