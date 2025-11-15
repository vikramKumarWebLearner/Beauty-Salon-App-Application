import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { NgApexchartsModule } from "ng-apexcharts";
import {
  LucideAngularModule,
  Users,
  Calendar,
  DollarSign,
  Clock,
  Star,
  BarChart3,
  Activity,
  ChartColumn,
  IndianRupee,
  TrendingDown,
  TrendingUp,
  Briefcase,
  Clock3,
  User,
  Phone,
  Mail,
  FileText,
  Timer
} from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    NgApexchartsModule,
    // provideLucideAngular(LucideIcons),
    importProvidersFrom(ReactiveFormsModule, FormsModule,
      LucideAngularModule.pick({
        TrendingUp,
        Users,
        Calendar,
        DollarSign,
        Clock,
        Star,
        BarChart3,
        Activity,
        ChartColumn,
        IndianRupee,
        TrendingDown,
        Briefcase,
        Clock3,
        User,
        Phone,
        Mail,
        FileText,
        Timer
      })
    )
  ]
};
