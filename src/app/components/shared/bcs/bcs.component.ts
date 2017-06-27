import { Component, OnInit } from '@angular/core';
import { imageApi } from 'app/apis';

@Component({
    selector: 'bcs-app',
    templateUrl: './bcs.component.html',
    styleUrls: [
        './bcs.component.scss'
    ]
})
export class BcsComponent implements OnInit {

    public cashRegisterImage: string;
    public ethereumLogo: string;
    // tslint:disable-next-line:no-empty
    constructor() { }

    // tslint:disable-next-line:no-trailing-whitespace
    // tslint:disable-next-line:no-empty
    public ngOnInit() { 
       console.log('BCS component loaded');
       this.ethereumLogo = imageApi.getImageData('ethereum');
       this.cashRegisterImage = imageApi.getImageData('cash_register');
    }

}
