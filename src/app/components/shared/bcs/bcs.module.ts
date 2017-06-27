import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BcsComponent } from './bcs.component';

const BCS_ROUTES: Routes = [
    {
        path: '',
        component: BcsComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(BCS_ROUTES)
     ],
    declarations: [ BcsComponent ]
})
export class BcsModule { }
