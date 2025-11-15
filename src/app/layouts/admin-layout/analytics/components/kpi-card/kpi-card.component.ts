import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'app-kpi-card',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    templateUrl: './kpi-card.component.html',
    styleUrl: './kpi-card.component.css'
})
export class KpiCardComponent {
    @Input() label: string = '';
    @Input() value: string | number = 0;
    @Input() change: string = '0%';
    @Input() trend: 'up' | 'down' = 'up';
    @Input() icon: string = 'trending-up';
    @Input() color: string = 'bg-blue-50 text-blue-600';

    get changeColor(): string {
        return this.trend === 'up' ? 'text-green-600' : 'text-red-600';
    }

    get trendIcon(): string {
        return this.trend === 'up' ? 'trending-up' : 'trending-down';
    }
}
