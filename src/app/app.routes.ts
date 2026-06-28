import { Routes } from '@angular/router';
import { authGuard } from './services/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./core/layout/layout').then(m => m.Layout),
    children: [
      {
         canActivate: [authGuard],
        path: '',
        loadComponent: () => import('./core/admin-home/admin-home').then(m => m.AdminHome)
      },
      {
         canActivate: [authGuard],
        path: 'bulk-import',
        loadComponent: () => import('./core/bulk-import/bulk-import').then(m => m.BulkImport)
      },
      {
         canActivate: [authGuard],
        path: 'contacts',
        loadComponent: () => import('./core/contacts/contacts').then(m => m.Contacts)
      },
      {
         canActivate: [authGuard],
        path: 'contacts-details',
        loadComponent: () => import('./core/contact-details/contact-details').then(m => m.ContactDetails)
      },
      {
         canActivate: [authGuard],
        path: 'pipeline',
        loadComponent: () => import('./core/pipeline/pipeline').then(m => m.Pipeline)
      },
      { 
        canActivate: [authGuard],
        path: 'users',
        loadComponent: () => import('./core/users/users').then(m => m.Users)
      },
      {
        canActivate: [authGuard],
        path: 'settings',
        loadComponent: () => import('./core/settings/settings').then(m => m.Settings)
      },
       {
        canActivate: [authGuard],
        path: 'email-templates',
        loadComponent: () => import('./core/email-templates/email-templates').then(m => m.EmailTemplates)
      },
      {
        canActivate: [authGuard],
        path: 'new-email-template',
        loadComponent: () => import('./core/new-email-template/new-email-template').then(m => m.NewEmailTemplate)
      },
      {
        canActivate: [authGuard],
        path: 'manage-subscriptions',
        loadComponent: () => import('./core/manage-subscriptions/manage-subscriptions').then(m => m.ManageSubscriptions)
      },
      {
        canActivate: [authGuard],
        path: 'add-new-subscription',
        loadComponent: () => import('./core/add-new-subscriptions/add-new-subscriptions').then(m => m.AddNewSubscriptions)
      },
      {
        canActivate: [authGuard],
        path: 'system-configurations',
        loadComponent: () => import('./core/system-configurations/system-configurations').then(m => m.SystemConfigurations)
      }
    ]
  },
  {
    path: 'login',
    loadComponent: () => import('./core/login/login').then(m => m.Login)
  }
];
