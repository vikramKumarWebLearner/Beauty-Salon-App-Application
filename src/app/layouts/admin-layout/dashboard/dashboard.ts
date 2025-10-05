import { Component } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, NgClass, LucideAngularModule],
  templateUrl: './dashboard.html'
})
export class Dashboard {
  stats = [
    {
      title: 'Total Revenue',
      value: '$12,450',
      change: '+12.5%',
      trend: 'up',
      icon: 'dollar-sign',  // remove 'lucide-' prefix
      color: 'text-green-600'
    },
    {
      title: 'Total Appointments',
      value: '324',
      change: '+8.2%',
      trend: 'up',
      icon: 'calendar',
      color: 'text-blue-600'
    },
    {
      title: 'Active Staff',
      value: '12',
      change: '+2',
      trend: 'up',
      icon: 'users',
      color: 'text-purple-600'
    },
    {
      title: 'Customer Satisfaction',
      value: '4.8',
      change: '+0.3',
      trend: 'up',
      icon: 'star',
      color: 'text-yellow-600'
    }
  ];


  recentAppointments = [
    { id: 1, customer: 'Emma Wilson', service: 'Hair Styling', time: '10:00 AM', staff: 'Sarah', status: 'completed' },
    { id: 2, customer: 'Michael Brown', service: 'Facial Treatment', time: '11:30 AM', staff: 'Lisa', status: 'in-progress' },
    { id: 3, customer: 'Sophie Turner', service: 'Manicure', time: '2:00 PM', staff: 'Anna', status: 'scheduled' },
    { id: 4, customer: 'James Davis', service: 'Hair Cut', time: '3:30 PM', staff: 'Mike', status: 'scheduled' },
  ];

  getStatusColor(status: string) {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }

  }
}
