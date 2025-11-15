import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-customer-satisfaction',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './customer-satisfaction.component.html',
    styleUrl: './customer-satisfaction.component.css'
})
export class CustomerSatisfactionComponent implements AfterViewInit, OnChanges {
    @Input() tabSelected: string = '';
    @ViewChild('satisfactionCanvas', { static: false }) satisfactionCanvas!: ElementRef<HTMLCanvasElement>;

    private ctx: CanvasRenderingContext2D | null = null;

    // Mock data for different tabs
    private chartData = {
        Revenue: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            values: [4.5, 4.6, 4.65, 4.7, 4.65, 4.8],
            color: 'rgb(236, 72, 153)',
            lineColor: 'rgba(236, 72, 153, 0.1)'
        },
        Appointments: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            values: [4.4, 4.5, 4.55, 4.65, 4.6, 4.75],
            color: 'rgb(59, 130, 246)',
            lineColor: 'rgba(59, 130, 246, 0.1)'
        },
        Services: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            values: [4.3, 4.45, 4.5, 4.6, 4.55, 4.7],
            color: 'rgb(168, 85, 247)',
            lineColor: 'rgba(168, 85, 247, 0.1)'
        },
        Staff: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            values: [4.2, 4.35, 4.4, 4.5, 4.45, 4.65],
            color: 'rgb(34, 197, 94)',
            lineColor: 'rgba(34, 197, 94, 0.1)'
        }
    };

    ngAfterViewInit() {
        this.drawChart();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['tabSelected'] && this.satisfactionCanvas) {
            setTimeout(() => this.drawChart(), 100);
        }
    }

    private drawChart() {
        if (!this.satisfactionCanvas) return;

        const canvas = this.satisfactionCanvas.nativeElement;
        this.ctx = canvas.getContext('2d');

        if (!this.ctx) return;

        // Set canvas size
        const rect = canvas.parentElement?.getBoundingClientRect();
        canvas.width = rect?.width || 400;
        canvas.height = rect?.height || 300;

        // Get current data
        const data = this.chartData[this.tabSelected as keyof typeof this.chartData] || this.chartData.Revenue;

        this.drawLineChart(data);
    }

    private drawLineChart(data: any) {
        if (!this.ctx) return;

        const canvas = this.satisfactionCanvas.nativeElement;
        const width = canvas.width;
        const height = canvas.height;
        const padding = 60;

        // Clear canvas
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, width, height);

        const maxValue = 5;
        const minValue = 4;

        // Draw grid
        this.ctx.strokeStyle = 'rgba(229, 231, 235, 0.5)';
        this.ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = padding + (i * (height - padding * 1.5)) / 4;
            this.ctx.beginPath();
            this.ctx.moveTo(padding, y);
            this.ctx.lineTo(width - 20, y);
            this.ctx.stroke();
        }

        // Calculate points
        const pointSpacing = (width - padding - 20) / (data.labels.length - 1);
        const scaleHeight = height - padding - 40;

        // Draw area under line
        this.ctx.fillStyle = data.lineColor;
        this.ctx.beginPath();
        this.ctx.moveTo(padding, height - 40);
        for (let i = 0; i < data.values.length; i++) {
            const x = padding + i * pointSpacing;
            const y = height - 40 - ((data.values[i] - minValue) / (maxValue - minValue)) * scaleHeight;
            this.ctx.lineTo(x, y);
        }
        this.ctx.lineTo(width - 20, height - 40);
        this.ctx.fill();

        // Draw line
        this.ctx.strokeStyle = data.color;
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        for (let i = 0; i < data.values.length; i++) {
            const x = padding + i * pointSpacing;
            const y = height - 40 - ((data.values[i] - minValue) / (maxValue - minValue)) * scaleHeight;
            if (i === 0) this.ctx.moveTo(x, y);
            else this.ctx.lineTo(x, y);
        }
        this.ctx.stroke();

        // Draw points
        this.ctx.fillStyle = data.color;
        for (let i = 0; i < data.values.length; i++) {
            const x = padding + i * pointSpacing;
            const y = height - 40 - ((data.values[i] - minValue) / (maxValue - minValue)) * scaleHeight;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 5, 0, Math.PI * 2);
            this.ctx.fill();

            // Draw white circle inside
            this.ctx.fillStyle = 'white';
            this.ctx.beginPath();
            this.ctx.arc(x, y, 3, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.fillStyle = data.color;
        }

        // Draw axes
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(padding, padding);
        this.ctx.lineTo(padding, height - 40);
        this.ctx.lineTo(width - 20, height - 40);
        this.ctx.stroke();

        // Draw x-axis labels
        this.ctx.fillStyle = '#666';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        for (let i = 0; i < data.labels.length; i++) {
            const x = padding + i * pointSpacing;
            this.ctx.fillText(data.labels[i], x, height - 15);
        }

        // Draw y-axis labels (4.0 to 5.0)
        this.ctx.textAlign = 'right';
        this.ctx.fillStyle = '#999';
        for (let i = 0; i <= 4; i++) {
            const value = (minValue + (maxValue - minValue) * (i / 4)).toFixed(2);
            const y = height - 40 - (i * scaleHeight) / 4;
            this.ctx.fillText(value, padding - 10, y + 5);
        }
    }
}
