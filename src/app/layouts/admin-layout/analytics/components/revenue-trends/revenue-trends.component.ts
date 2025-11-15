import {
    Component,
    Input,
    ViewChild,
    ElementRef,
    AfterViewInit,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-revenue-trends',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './revenue-trends.component.html',
    styleUrl: './revenue-trends.component.css'
})
export class RevenueTrendsComponent implements AfterViewInit, OnChanges {
    @Input() tabSelected: string = '';
    @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;

    private ctx: CanvasRenderingContext2D | null = null;

    // ==============================
    //     Chart Data (UPDATED)
    // ==============================
    private chartData = {
        Revenue: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            values: [9000, 9500, 9800, 10200, 10800, 13000],
            target: [10000, 10000, 10000, 11000, 11000, 12000],

            // 🔥 MATCHES YOUR IMAGE EXACTLY
            color: 'rgba(233, 71, 125, 0.15)',      // soft pink fill
            borderColor: 'rgb(233, 71, 125)',       // pink line
            targetColor: 'rgba(200, 200, 200, 0.25)'// soft grey target fill
        },
        Appointments: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            values: [300, 320, 310, 350, 380, 420],
            target: [350, 350, 350, 380, 380, 400],
            color: 'rgba(59, 130, 246, 0.1)',
            borderColor: 'rgb(59, 130, 246)',
            targetColor: 'rgba(156,163,175,0.2)'
        },
        Services: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            values: [45, 48, 52, 55, 58, 62],
            target: [50, 50, 50, 55, 55, 60],
            color: 'rgba(168, 85, 247, 0.1)',
            borderColor: 'rgb(168, 85, 247)',
            targetColor: 'rgba(156,163,175,0.2)'
        },
        Staff: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            values: [5, 5, 6, 6, 7, 8],
            target: [5, 5, 6, 6, 6, 7],
            color: 'rgba(34, 197, 94, 0.1)',
            borderColor: 'rgb(34, 197, 94)',
            targetColor: 'rgba(156,163,175,0.2)'
        }
    };

    ngAfterViewInit() {
        this.initAndRender();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['tabSelected']) {
            setTimeout(() => this.initAndRender(), 100);
        }
    }

    private initAndRender() {
        if (!this.chartCanvas) return;

        const canvas = this.chartCanvas.nativeElement;
        const parent = canvas.parentElement?.getBoundingClientRect();

        canvas.width = parent?.width || 400;
        canvas.height = parent?.height || 300;

        this.ctx = canvas.getContext('2d');
        if (!this.ctx) return;

        this.renderCanvasChart();
    }

    private renderCanvasChart() {
        if (!this.ctx) return;

        const ctx = this.ctx;
        const canvas = this.chartCanvas.nativeElement;

        const width = canvas.width;
        const height = canvas.height;

        const padding = 60;
        const bottomPadding = 40;

        const data =
            this.chartData[this.tabSelected as keyof typeof this.chartData] ??
            this.chartData.Revenue;

        const maxValue = Math.max(...data.values, ...data.target);
        const scaleHeight = height - padding - bottomPadding;
        const pointSpacing = (width - padding - 20) / (data.labels.length - 1);

        ctx.clearRect(0, 0, width, height);

        // ==============================
        //          GRID LINES
        // ==============================
        ctx.strokeStyle = 'rgba(220,220,220,0.55)'; // softer like screenshot
        ctx.lineWidth = 1;

        for (let i = 0; i <= 4; i++) {
            const y = padding + (i * scaleHeight) / 4;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - 20, y);
            ctx.stroke();
        }

        // ==============================
        //      TARGET FILLED AREA
        // ==============================
        ctx.fillStyle = data.targetColor;
        ctx.beginPath();
        ctx.moveTo(padding, height - bottomPadding);

        data.target.forEach((t, i) => {
            const x = padding + i * pointSpacing;
            const y = height - bottomPadding - (t / maxValue) * scaleHeight;
            ctx.lineTo(x, y);
        });

        ctx.lineTo(width - 20, height - bottomPadding);
        ctx.fill();

        // ==============================
        //       TARGET DASHED LINE
        // ==============================
        ctx.strokeStyle = 'rgba(160,160,160,0.6)';
        ctx.setLineDash([6, 6]);
        ctx.beginPath();

        data.target.forEach((t, i) => {
            const x = padding + i * pointSpacing;
            const y = height - bottomPadding - (t / maxValue) * scaleHeight;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });

        ctx.stroke();
        ctx.setLineDash([]);

        // ==============================
        //       MAIN FILLED AREA
        // ==============================
        ctx.fillStyle = data.color;
        ctx.beginPath();
        ctx.moveTo(padding, height - bottomPadding);

        data.values.forEach((val, i) => {
            const x = padding + i * pointSpacing;
            const y = height - bottomPadding - (val / maxValue) * scaleHeight;
            ctx.lineTo(x, y);
        });

        ctx.lineTo(width - 20, height - bottomPadding);
        ctx.fill();

        // ==============================
        //          MAIN LINE
        // ==============================
        ctx.strokeStyle = data.borderColor;
        ctx.lineWidth = 3;

        ctx.beginPath();
        data.values.forEach((val, i) => {
            const x = padding + i * pointSpacing;
            const y = height - bottomPadding - (val / maxValue) * scaleHeight;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // ==============================
        //        POINT DOTS
        // ==============================
        ctx.fillStyle = data.borderColor;
        data.values.forEach((val, i) => {
            const x = padding + i * pointSpacing;
            const y = height - bottomPadding - (val / maxValue) * scaleHeight;

            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();
        });

        // ==============================
        //             AXES
        // ==============================
        ctx.strokeStyle = '#b5a6a8'; // like original image
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - bottomPadding);
        ctx.lineTo(width - 20, height - bottomPadding);
        ctx.stroke();

        // ==============================
        //           X LABELS
        // ==============================
        ctx.fillStyle = '#555';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';

        data.labels.forEach((label, i) => {
            const x = padding + i * pointSpacing;
            ctx.fillText(label, x, height - 10);
        });

        // ==============================
        //           Y LABELS
        // ==============================
        ctx.textAlign = 'right';
        ctx.fillStyle = '#888';

        for (let i = 0; i <= 4; i++) {
            const value = Math.round((maxValue / 4) * i);
            const y = height - bottomPadding - (i * scaleHeight) / 4;
            ctx.fillText(value.toString(), padding - 10, y + 5);
        }
    }
}
