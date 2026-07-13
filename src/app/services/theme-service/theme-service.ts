// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root',
// })
// export class ThemeService {}


import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeCssService {

  loadTheme(theme: 'custom' | 'supper-admin') {
    let link = document.getElementById('theme-css') as HTMLLinkElement;

    if (!link) {
      link = document.createElement('link');
      link.id = 'theme-css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }

    link.href = `assets/css/${theme}.css`;
  }

  removeTheme() {
    const link = document.getElementById('theme-css');
    if (link) {
      link.remove();
    }
  }
}