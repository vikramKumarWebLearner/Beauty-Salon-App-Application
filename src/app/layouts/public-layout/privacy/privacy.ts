import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

@Component({
    selector: 'app-privacy',
    imports: [CommonModule, RouterModule],
    templateUrl: './privacy.html',
    styleUrl: './privacy.css',
})
export class Privacy {
    constructor(private titleService: Title, private meta: Meta) {
        this.titleService.setTitle('Privacy Policy - Bella Beauty');
        this.meta.updateTag({ name: 'description', content: 'Privacy Policy for Bella Beauty Salon. Learn how we collect and use your information.' });
    }
}
