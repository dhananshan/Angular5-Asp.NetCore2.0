import { HomeComponent } from '../../_component/home/home.component';

import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../_guard/auth.guard'

export const SecureRoutes: Routes = [
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
];