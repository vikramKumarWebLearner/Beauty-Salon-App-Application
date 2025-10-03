export interface SidebarItem {
    label: string;
    icon?: string;
    route?: string;
    children?: SidebarItem[];
    roles?: string[]; // optional, for role-based visibility
}
