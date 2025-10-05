import { Component } from '@angular/core';
import { Header } from '../../../shared/components/public/header/header';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderItem } from '../../../core/models/header-item.model';
import { CommonModule } from '@angular/common';
import { Footer } from '../../../shared/components/public/footer/footer';
@Component({
  selector: 'app-home',
  imports: [Header, RouterOutlet, CommonModule, Footer],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  private readonly initialSidebarItems: HeaderItem[] = [
    { path: '/', label: 'Home' },
    { path: '/services', label: 'Services' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/pricing', label: 'Pricing' },
    { path: '/team', label: 'Team' },
    { path: '/testimonials', label: 'Reviews' },
    { path: '/about', label: 'About' },
    { path: '/blog', label: 'Blog' },
    { path: '/contact', label: 'Contact' },
  ]
  stars = Array(5); // for review stars
}
