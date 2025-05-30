import {Component, OnInit} from '@angular/core';
import {CommonModule, Location} from "@angular/common";
import {FileResultData, Result, RiskDistribution, TopTriggeredRule} from "../../helper/interface";
import {ChartModule} from "primeng/chart";
import {TableModule} from "primeng/table";

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [ChartModule, TableModule, CommonModule],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss'
})
export class StatisticsComponent implements OnInit {
  resultData: FileResultData | null = null;
  chartData: any;
  chartOptions: any;
  top_triggered_rules: TopTriggeredRule[] = [];
  risk_distribution: RiskDistribution | undefined = undefined;
  results: Result[] = [];
  top10transactionByAmount: Result[] = [];
  top10HighRisk: Result[] = [];
  chartDataTopTriggeredRules: any;
  chartOptionsTopTriggeredRules: any;


  constructor(private location: Location) {
  }

  ngOnInit(): void {
    const state = this.location.getState() as { data?: FileResultData };

    if (state?.data) {
      console.log('Полученные данные из state:', state.data);
      this.resultData = state.data;
      this.results = state.data.results;
      this.top_triggered_rules = state.data.summary.top_triggered_rules;
      this.risk_distribution = state.data.summary.risk_distribution;

      // Сохраняем в localStorage на будущее
      localStorage.setItem('fileResult', JSON.stringify(state.data));
    } else {
      const storedData = localStorage.getItem('fileResult');
      if (storedData) {
        this.resultData = JSON.parse(storedData);
        this.results = this.resultData?.results ?? [];
        this.top_triggered_rules = this.resultData?.summary.top_triggered_rules ?? [];
        this.risk_distribution = this.resultData?.summary.risk_distribution;

        console.log('Данные получены из localStorage');
      } else {
        console.warn('Нет данных в state или localStorage');
        return;
      }
    }

    // Общая логика для обоих случаев:
    this.top10transactionByAmount = this.getTop10TransactionByAmount();
    this.top10HighRisk = this.getTop10HighRisk();
    console.log(this.top10transactionByAmount);

    this.getRiskDistribution();
    this.getTopTriggeredRules();
  }

  getTop10HighRisk() {
    return this.results
      .sort((a, b) => b.risk_score - a.risk_score)
      .slice(0, 10);
  }

  getTop10TransactionByAmount() {
    return this.results
      .map(tx => ({
        ...tx,
        amountNumeric: parseFloat(tx.analysis_details.amount.replace(/\s/g, '').replace(',', '.')),
      }))
      .sort((a, b) => b.amountNumeric - a.amountNumeric)
      .slice(0, 10);
  }

  getTopTriggeredRules() {
    this.chartDataTopTriggeredRules = {
      labels: this.top_triggered_rules.map(r => r.description),
      datasets: [
        {
          label: 'Количество',
          backgroundColor: '#42A5F5',
          data: this.top_triggered_rules.map(r => r.count)
        }
      ]
    };

    this.chartOptionsTopTriggeredRules = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 100
          }
        }
      }
    };
  }

  getRiskDistribution() {

    this.chartData = {
      labels: ['High Risk', 'Medium Risk', 'Low Risk'],
      datasets: [
        {
          label: 'Количество',
          data: [
            this.risk_distribution?.high_risk.count || 0,
            this.risk_distribution?.medium_risk.count || 0,
            this.risk_distribution?.low_risk.count || 0,
          ],
          backgroundColor: ['#e74c3c', '#f1c40f', '#2ecc71']
        }
      ]
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top'
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const label = context.dataset.label || '';
              const value = context.raw;
              const percentage = [
                this.risk_distribution?.high_risk.percentage,
                this.risk_distribution?.medium_risk.percentage,
                this.risk_distribution?.low_risk.percentage
              ][context.dataIndex];
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 1000,
          ticks: {
            stepSize: 100
          }
        }

      }
    };
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
