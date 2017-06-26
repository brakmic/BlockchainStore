import { NavigationExtras } from '@angular/router';
export interface IRoute {
    index?: number;
    name?: string;
    commands: any[];
    extras?: NavigationExtras;
}
