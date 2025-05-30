import {Component, OnInit} from '@angular/core';
import {Location} from "@angular/common";
import {FileResultData} from "../../helper/interface";

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss'
})
export class StatisticsComponent implements OnInit{
  resultData: FileResultData | null = null;
  constructor(private location: Location) {
  }

  ngOnInit(): void {
    const state = this.location.getState() as { data: FileResultData };
    console.log('Полученные данные:', state.data);
    this.resultData = state.data;
  }

  getPercentage(risk_count: number): string {
    const processed = this.resultData?.statistics?.processed_transactions;

    if (!processed || processed === 0) {
      return '0%';
    }

    const percentage = (risk_count / processed) * 100;
    return percentage.toFixed(1) + '%';
  }

}
