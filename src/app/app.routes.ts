import { Routes } from '@angular/router';
import { FullComponent } from './layouts/full/full.component';
import { UsersComponent } from './pages/users/users.component';

import { AppSideLoginComponent } from './pages/side-login/side-login.component';
import { AppSideRegisterComponent } from './pages/authentication/side-register/side-register.component';

import { PageLoaderComponent } from './pages/page-loader/page-loader.component';
import { StarterComponent } from './pages/starter/starter.component';
import { AddUserComponent } from './pages/users/components/add-user/add-user.component';
import { EditUserComponent } from './pages/users/components/edit-user/edit-user.component';

import { historyComponent } from './pages/history/history.component';
import { FacteurComponent } from './pages/facteurs/facteurs';
import { AddfacteurComponent } from './pages/facteurs/components/add-product/add-facteur.component';
import { EditFacteurComponent } from './pages/facteurs/components/edit/edit-facteur.component';
import { ClientsComponent } from './pages/clients/clients';
import { AddClientComponent } from './pages/clients/components/add/add.component';
import { EditClientComponent } from './pages/clients/components/edit/edit.component';
import { FacteurDetailsComponent } from './pages/facteurs/components/details/details';
import { NotesComponent } from './pages/notes/notes';
import { DebtsComponent } from './pages/debst/debts';
import { prodsComponent } from './pages/prods/prods';

export const routes: Routes = [
  {
    path: '',
    component: PageLoaderComponent,
  },
  {
    path: 'login',
    component: AppSideLoginComponent,
  },
  {
    path: 'register',
    component: AppSideRegisterComponent,
  },

  // route table for admin interface
  {
    path: 'admin',
    component: FullComponent,
    children: [
      {
        path: '',
        component: StarterComponent,
      },

      {
        path: 'users',
        component: UsersComponent,
      },

      {
        path: 'add-users',
        component: AddUserComponent,
      },
      {
        path: 'history',
        component: historyComponent,
      },

      {
        path: 'edit-users/:id',
        component: EditUserComponent,
      },

      {
        path: 'facteurs',
        component: FacteurComponent,
      },
      {
        path: 'clients',
        component: ClientsComponent,
      },
      {
        path: 'notes',
        component: NotesComponent,
      },
      {
        path: 'add-clients',
        component: AddClientComponent,
      },
      {
        path: 'debts',
        component: DebtsComponent,
      },
      {
        path: 'prods',
        component: prodsComponent,
      },
      {
        path: 'edit-clients/:id',
        component: EditClientComponent,
      },
      {
        path: 'facteur-details/:id',
        component: FacteurDetailsComponent,
      },

      {
        path: 'add-facteurs',
        component: AddfacteurComponent,
      },

      {
        path: 'edit-facteurs/:id',
        component: EditFacteurComponent,
      },
    ],
  },

  {
    path: '**',
    redirectTo: 'authentication/error',
  },
];
