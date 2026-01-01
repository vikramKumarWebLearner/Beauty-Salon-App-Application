import { Component } from '@angular/core';
import { Header } from '../../shared/components/public/header/header';
import { Footer } from '../../shared/components/public/footer/footer';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-public-layout',
    standalone: true,
    imports: [Header, RouterOutlet, CommonModule, Footer],
    template: `
    <app-header></app-header>
    <main class="min-h-screen">
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
  `,
    styles: []
})
export class PublicLayout { }
