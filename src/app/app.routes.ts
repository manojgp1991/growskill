import { Routes } from '@angular/router';
import { authGuard } from './services/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./core/layout/layout').then(m => m.Layout),
    children: [
      {
        path: '',
        loadComponent: () => import('./core/admin-home/admin-home').then(m => m.AdminHome)
      },
      {
        path: 'bulk-import',
        loadComponent: () => import('./core/bulk-import/bulk-import').then(m => m.BulkImport)
      },
      {
        path: 'contacts',
        loadComponent: () => import('./core/contacts/contacts').then(m => m.Contacts)
      },
      {
        path: 'contacts-details',
        loadComponent: () => import('./core/contact-details/contact-details').then(m => m.ContactDetails)
      },
      {
        path: 'pipeline',
        loadComponent: () => import('./core/pipeline/pipeline').then(m => m.Pipeline)
      },
      { 
        canActivate: [authGuard],
        path: 'users',
        loadComponent: () => import('./core/users/users').then(m => m.Users)
      },
      {
        path: 'settings',
        loadComponent: () => import('./core/settings/settings').then(m => m.Settings)
      }
    ]
  },
  {
    path: 'login',
    loadComponent: () => import('./core/login/login').then(m => m.Login)
  }
];
