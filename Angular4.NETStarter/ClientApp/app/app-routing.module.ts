import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { SecureRoutes } from './_layout/secure/secure.routes';
import { PublicRoutes } from './_layout/public/public.routes';

import { SecureComponent } from './_layout/secure/secure.component';
import { PublicComponent } from './_layout/public/public.component';

import { AuthGuard } from './_guard/auth.guard'

/**
 * Route constant
 */

/**
TODO:
-CanActivateChild
-CanDeactivate(for edit pages) 
*/

const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '', component: PublicComponent, children: PublicRoutes },
    { path: '', component: SecureComponent, canActivate: [AuthGuard], children: SecureRoutes },
    { path: '**', redirectTo: 'login' }
];

/**
 * App routing module
 */
@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }