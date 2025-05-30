import {Component} from '@angular/core';
import {Router, NavigationEnd, RouterOutlet} from '@angular/router';
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    FormsModule,
    RouterOutlet,
    NgIf
  ],
  standalone: true
})
export class AppComponent {
  isOpen = true;
  selectedRoute = 'load-data';

  constructor(private router: Router) {
    // this.setRouteFromUrl();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.setRouteFromUrl(); // переопредели selectedRoute
      }
    });
  }

  private setRouteFromUrl() {
    const currentUrl = this.router.url;
    console.log(currentUrl);
    if (currentUrl.includes('load-data')) {
      this.selectedRoute = 'load-data';
    } else if (currentUrl.includes('statistics')) {
      this.selectedRoute = 'statistics';
    } else if (currentUrl.includes('detailed-analysis')) {
      this.selectedRoute = 'detailed-analysis';
    } else if (currentUrl.includes('settings')) {
      this.selectedRoute = 'settings';
    }
    // Добавь другие условия при необходимости
  }

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }

  onRadioChange(route: string) {
    this.router.navigate([route]);
  }
}
