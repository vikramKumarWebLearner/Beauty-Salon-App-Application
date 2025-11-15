import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-tabs',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './tabs.component.html',
    styleUrl: './tabs.component.css'
})
export class TabsComponent {
    @Input() tabs: Array<{ label: string; value: string }> = [];
    @Input() selectedTab: string = '';
    @Output() tabChange = new EventEmitter<string>();

    onTabClick(value: string) {
        this.tabChange.emit(value);
    }

    isActive(value: string): boolean {
        return this.selectedTab === value;
    }
}
