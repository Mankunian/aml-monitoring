import { Component } from '@angular/core';
import {InputNumberModule} from "primeng/inputnumber";
import {FormsModule} from "@angular/forms";
import {InputTextareaModule} from "primeng/inputtextarea";
import {Button} from "primeng/button";

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    InputNumberModule,
    FormsModule,
    InputTextareaModule,
    Button
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  thresholdValue: number = 10000000;
  previousValue: number = this.thresholdValue;
  highRiskCountriesList: string[] = [
    '840', '392', '36', '826', '276', '784', '756', '156', '702', '410'
  ];

  highRiskOperationTypes: string[] = ['2020', '1001', '1002', '7001', '7002'];

  minOfSuspiciousAmount = 8000000;
  maxOfSuspiciousAmount = 9999999;

  onValueChange(newValue: number) {
    if (newValue > this.previousValue) {
      console.log('Нажатие + : +1000000');
    } else if (newValue < this.previousValue) {
      console.log('Нажатие – : -1000000');
    }

    this.previousValue = newValue;
  }
}
