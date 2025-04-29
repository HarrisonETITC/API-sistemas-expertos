import { Routes } from '@angular/router';
import { MainpageComponent } from './components/mainpage/mainpage.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: MainpageComponent
    }
];
