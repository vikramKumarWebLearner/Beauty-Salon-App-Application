import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { DashboardService } from '../../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgClass, RouterLink, LucideAngularModule],
  templateUrl: './dashboard.html'
})
export class Dashboard implements OnInit {
  private dashboardService = inject(DashboardService);
  loading = signal(true);
  stats: any[] = [];
  recentAppointments: any[] = [];
  totalAppointments: any = 0;
  totalRenview: number = 0;

  ngOnInit() {
    // Uncomment the line below to use real API data
    this.loadDashboardData();
  }

  /** 🔥 Call API and update UI */
  loadDashboardData() {
    this.loading.set(true);// ✅ start loader before API call

    this.dashboardService.getDashboardDetails().subscribe({
      next: (res) => {
        if (res && res.success) {
          const data = res.data;
          this.stats = [
            {
              title: 'Total Revenue',
              value: `₹${data.cards?.totalRevenue?.value || 0}`,
              change: data.cards?.totalRevenue?.change || '0%',
              trend: this.getTrend(data.cards?.totalRevenue?.change || '0%'),
              icon: 'indian-rupee',
              color: 'text-green-600'
            },
            {
              title: 'Total Appointments',
              value: data.cards?.totalAppointments?.value || 0,
              change: data.cards?.totalAppointments?.change || '0%',
              trend: this.getTrend(data.cards?.totalAppointments?.change || '0%'),
              icon: 'calendar',
              color: 'text-blue-600'
            },
            {
              title: 'Active Staff',
              value: data.cards?.activeStaff?.value || 0,
              change: data.cards?.activeStaff?.change || '0%',
              trend: this.getTrend(data.cards?.activeStaff?.change || '0%'),
              icon: 'users',
              color: 'text-purple-600'
            },
            {
              title: 'Customer Satisfaction',
              value: data.cards?.customerSatisfaction?.value || '0%',
              change: data.cards?.customerSatisfaction?.change || '0%',
              trend: this.getTrend(data.cards?.customerSatisfaction?.change || '0%'),
              icon: 'star',
              color: 'text-yellow-600'
            }
          ];

          this.recentAppointments = data?.recentAppointments || [];
          this.totalAppointments = data?.overview?.todayAppointments || 0;
          this.totalRenview = data?.cards?.totalRevenue?.value || 0;
        } else {
          this.setDefaultData();
        }
        this.loading.set(false); // ✅ hide loader after success
      },
      error: (err) => {
        console.error('Error details:', err);
        this.setDefaultData();
        this.loading.set(true); // ✅ hide loader even after failure
      }
    });
  }


  /** Set default data when API fails */
  setDefaultData() {
    // console.log('🔄 Setting default dashboard data...');
    this.stats = [
      {
        title: 'Total Revenue',
        value: '$0',
        change: '0%',
        trend: 'up',
        icon: 'dollar-sign',
        color: 'text-green-600'
      },
      {
        title: 'Total Appointments',
        value: 0,
        change: '0%',
        trend: 'up',
        icon: 'calendar',
        color: 'text-blue-600'
      },
      {
        title: 'Active Staff',
        value: 0,
        change: '0%',
        trend: 'up',
        icon: 'users',
        color: 'text-purple-600'
      },
      {
        title: 'Customer Satisfaction',
        value: '0%',
        change: '0%',
        trend: 'up',
        icon: 'star',
        color: 'text-yellow-600'
      }
    ];
    this.recentAppointments = [];
  }

  /** Load mock data for testing */
  loadMockData() {
    // console.log('🧪 Loading mock dashboard data...');
    this.loading.set(false);

    // Simulate API delay
    // setTimeout(() => {
    //   this.stats = [
    //     {
    //       title: 'Total Revenue',
    //       value: '$12,450',
    //       change: '+12.5%',
    //       trend: 'up',
    //       icon: 'dollar-sign',
    //       color: 'text-green-600'
    //     },
    //     {
    //       title: 'Total Appointments',
    //       value: 48,
    //       change: '+8.2%',
    //       trend: 'up',
    //       icon: 'calendar',
    //       color: 'text-blue-600'
    //     },
    //     {
    //       title: 'Active Staff',
    //       value: 6,
    //       change: '+2',
    //       trend: 'up',
    //       icon: 'users',
    //       color: 'text-purple-600'
    //     },
    //     {
    //       title: 'Customer Satisfaction',
    //       value: '94%',
    //       change: '+3.1%',
    //       trend: 'up',
    //       icon: 'star',
    //       color: 'text-yellow-600'
    //     }
    //   ];

    //   this.recentAppointments = [
    //     {
    //       customer: 'Sarah Johnson',
    //       service: 'Hair Cut & Style',
    //       time: '2:00 PM',
    //       staff: 'Emma Wilson',
    //       status: 'completed'
    //     },
    //     {
    //       customer: 'Michael Brown',
    //       service: 'Beard Trim',
    //       time: '2:30 PM',
    //       staff: 'Alex Davis',
    //       status: 'in-progress'
    //     },
    //     {
    //       customer: 'Lisa Garcia',
    //       service: 'Manicure & Pedicure',
    //       time: '3:00 PM',
    //       staff: 'Maria Rodriguez',
    //       status: 'scheduled'
    //     },
    //     {
    //       customer: 'David Lee',
    //       service: 'Hair Color',
    //       time: '3:30 PM',
    //       staff: 'Emma Wilson',
    //       status: 'scheduled'
    //     }
    //   ];

    //   this.loading = false;
    //   // console.log('✅ Mock data loaded successfully');
    // }, 1000);
  }

  /** 📊 Decide if trend is up or down */
  getTrend(change: string) {
    return change.startsWith('-') ? 'down' : 'up';
  }

  getStatusColor(status: string) {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

}
