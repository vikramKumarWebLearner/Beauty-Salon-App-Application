import { Component } from '@angular/core';
import { HeaderItem } from '../../../core/models/header-item.model';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-home',
  imports: [CommonModule],
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
