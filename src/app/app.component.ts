import { Component } from '@angular/core';
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
  }

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }

  onRadioChange(route: string) {
    this.router.navigate([route]);

  }
}
