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

  constructor(private location: Location) {
  }

  ngOnInit(): void {
    const state = this.location.getState() as { data: FileResultData };
    console.log('Полученные данные:', state.data);
  }
}
