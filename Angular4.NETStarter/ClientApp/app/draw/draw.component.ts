import { Component, ViewEncapsulation } from '@angular/core';
import { ElementDetails } from '../model/ElementDetails'



@Component({

    templateUrl: 'draw.component.html'
})



export class DrawComponent {

    title = 'SVG Drawing Demo!';
    elementContainer: Array<ElementDetails>;


    constructor() {
        this.elementContainer = new Array<ElementDetails>();
        this.loadDrawing();
    }


    loadDrawing(){
        var a = new ElementDetails();
        a.Type = 'rect';
        a.x1 = 20;
        a.y1 = 50;
        this.elementContainer.push(a);


        var b = new ElementDetails();
        b.Type = 'line';
        b.x1 = 35;
        b.y1 = 58;
        b.x2 = 200;
        b.y2 = 58;
        b.color = 'grey';
        this.elementContainer.push(b);


        var c = new ElementDetails();
        c.Type = 'rect';
        c.x1 = 215;
        c.y1 = 50;
        this.elementContainer.push(c);


        var d = new ElementDetails();
        d.Type = 'line';
        d.x1 = 230;
        d.y1 = 58;
        d.x2 = 395;
        d.y2 = 58;
        d.color = 'grey';
        this.elementContainer.push(d);



        var e = new ElementDetails();
        e.Type = 'rect';
        e.x1 = 410;
        e.y1 = 50;
        this.elementContainer.push(e);




    }

    triggerRect() {
        alert('rect clicked');
    }
    triggerLine() {
        this.elementContainer[1].color = 'red';
       // this.fillAttr = 'red';
    }
}