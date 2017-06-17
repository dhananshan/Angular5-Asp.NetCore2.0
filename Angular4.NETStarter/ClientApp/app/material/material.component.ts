import { Component } from '@angular/core';



@Component({
    templateUrl: 'material.component.html'
})


export class MaterialComponent {
    title = 'Hello World!';

    onButtonClick() {
        this.title = 'Hello from Material UI!';
    }
} 