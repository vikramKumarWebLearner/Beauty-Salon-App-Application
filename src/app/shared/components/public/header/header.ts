import { Component, signal, computed } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
// import { NgClass, NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.html'
})
export class Header {
  // state for mobile menu
  mobileMenuOpen = signal(false);

  constructor(private router: Router) { }

  // nav links
  navLinks = [
    { path: '/', label: 'Home' },
    { path: '/services', label: 'Services' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/pricing', label: 'Pricing' },
    { path: '/team', label: 'Team' },
    { path: '/testimonials', label: 'Reviews' },
    { path: '/about', label: 'About' },
    { path: '/blog', label: 'Blog' },
    { path: '/contact', label: 'Contact' },
  ];

  // active link checker
  isActive(path: string): boolean {
    return this.router.url === path || (path === '/' && this.router.url === '/');
  }

  toggleMenu() {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMenu() {
    this.mobileMenuOpen.set(false);
  }
}
