import { Routes } from '@angular/router';
import {LoadDataComponent} from "./pages/load-data/load-data.component";
import {StatisticsComponent} from "./pages/statistics/statistics.component";
import {DetailedAnalysisComponent} from "./pages/detailed-analysis/detailed-analysis.component";
import {SettingsComponent} from "./pages/settings/settings.component";

export const routes: Routes = [
  { path: 'load-data', component: LoadDataComponent },
  { path: 'statistics', component: StatisticsComponent },
  { path: 'detailed-analysis', component: DetailedAnalysisComponent },
  { path: 'settings', component: SettingsComponent },

  // Роут по умолчанию (перенаправление)
  { path: '', redirectTo: 'load-data', pathMatch: 'full' },

  // Опционально: страница 404
  { path: '**', redirectTo: 'load-data' },
];
