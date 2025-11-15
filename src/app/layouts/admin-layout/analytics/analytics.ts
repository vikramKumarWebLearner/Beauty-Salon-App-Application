import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { DashboardService } from '../../../core/services/dashboard.service';
import { KpiCardComponent } from './components/kpi-card/kpi-card.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { RevenueTrendsComponent } from './components/revenue-trends/revenue-trends.component';
import { CustomerSatisfactionComponent } from './components/customer-satisfaction/customer-satisfaction.component';

@Component({
    selector: 'app-analytics',
    standalone: true,
    imports: [
        CommonModule,
        LucideAngularModule,
        KpiCardComponent,
        TabsComponent,
        RevenueTrendsComponent,
        CustomerSatisfactionComponent
    ],
    templateUrl: './analytics.html',
    styleUrl: './analytics.css'
})
export class Analytics implements OnInit {
    private dashboardService = inject(DashboardService);

    loading = signal(true);
    selectedTab = signal('Revenue');
    kpiData: any[] = [];

    tabs = [
        { label: 'Revenue', value: 'Revenue' },
        { label: 'Appointments', value: 'Appointments' },
        { label: 'Services', value: 'Services' },
        { label: 'Staff', value: 'Staff' }
    ];

    ngOnInit() {
        this.loadAnalyticsData();
    }

    loadAnalyticsData() {
        this.loading.set(true);

        this.dashboardService.getDashboardDetails().subscribe({
            next: (res) => {
                if (res && res.success) {
                    this.prepareKpiData(res.data);
                } else {
                    this.setDefaultData();
                }
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Error loading analytics:', err);
                this.setDefaultData();
                this.loading.set(false);
            }
        });
    }

    private prepareKpiData(data: any) {
        this.kpiData = [
            {
                label: 'Total Revenue',
                value: `₹${data.cards?.totalRevenue?.value || 0}`,
                change: data.cards?.totalRevenue?.change || '0%',
                trend: this.getTrend(data.cards?.totalRevenue?.change || '0%'),
                icon: 'indian-rupee',
                color: 'bg-green-50 text-green-600'
            },
            {
                label: 'Total Appointments',
                value: data.cards?.totalAppointments?.value || 0,
                change: data.cards?.totalAppointments?.change || '0%',
                trend: this.getTrend(data.cards?.totalAppointments?.change || '0%'),
                icon: 'calendar',
                color: 'bg-blue-50 text-blue-600'
            },
            {
                label: 'Active Customers',
                value: data.cards?.activeCustomers?.value || 0,
                change: data.cards?.activeCustomers?.change || '0%',
                trend: this.getTrend(data.cards?.activeCustomers?.change || '0%'),
                icon: 'users',
                color: 'bg-purple-50 text-purple-600'
            },
            {
                label: 'Satisfaction Rate',
                value: data.cards?.customerSatisfaction?.value || '0%',
                change: data.cards?.customerSatisfaction?.change || '0%',
                trend: this.getTrend(data.cards?.customerSatisfaction?.change || '0%'),
                icon: 'star',
                color: 'bg-yellow-50 text-yellow-600'
            }
        ];
    }

    private setDefaultData() {
        this.kpiData = [
            {
                label: 'Total Revenue',
                value: '₹0',
                change: '0%',
                trend: 'up',
                icon: 'indian-rupee',
                color: 'bg-green-50 text-green-600'
            },
            {
                label: 'Total Appointments',
                value: 0,
                change: '0%',
                trend: 'up',
                icon: 'calendar',
                color: 'bg-blue-50 text-blue-600'
            },
            {
                label: 'Active Customers',
                value: 0,
                change: '0%',
                trend: 'up',
                icon: 'users',
                color: 'bg-purple-50 text-purple-600'
            },
            {
                label: 'Satisfaction Rate',
                value: '0%',
                change: '0%',
                trend: 'up',
                icon: 'star',
                color: 'bg-yellow-50 text-yellow-600'
            }
        ];
    }

    onTabChange(tab: string) {
        this.selectedTab.set(tab);
    }

    retry() {
        this.loadAnalyticsData();
    }

    private getTrend(change: string): 'up' | 'down' {
        return change.startsWith('-') ? 'down' : 'up';
    }
}
