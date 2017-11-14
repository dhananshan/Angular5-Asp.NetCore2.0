import { LoginComponent } from '../../_component/login/login.component';;

import { Routes, RouterModule } from '@angular/router';

export const PublicRoutes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
];