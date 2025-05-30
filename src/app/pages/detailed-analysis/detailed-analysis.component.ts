import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {Result} from "../../helper/interface";
import {TableModule} from "primeng/table";
import {Button} from "primeng/button";
import {DropdownModule} from "primeng/dropdown";
import {FormsModule} from "@angular/forms";
import {MessagesModule} from "primeng/messages";
import {Message} from "primeng/api";
import {InputTextareaModule} from "primeng/inputtextarea";
import {PanelModule} from "primeng/panel";
import {CardModule} from "primeng/card";
import {MultiSelectModule} from "primeng/multiselect";
import {SliderModule} from "primeng/slider";

@Component({
  selector: 'app-detailed-analysis',
  standalone: true,
  imports: [CommonModule, TableModule, Button, DropdownModule, FormsModule, MessagesModule, InputTextareaModule, PanelModule, CardModule, MultiSelectModule, SliderModule],
  templateUrl: './detailed-analysis.component.html',
  styleUrl: './detailed-analysis.component.scss'
})
export class DetailedAnalysisComponent implements OnInit {
  results: Result[] = [];
  selectedTransactionId: number | null = null;
  selectedTransaction: Result | null = null;
  transactionOptions: any;
  recommendationMessages: Message[] = [];
  riskOptions = [
    {label: 'Высокий', value: 'high'},
    {label: 'Средний', value: 'medium'}
  ];
  selectedRisks: string[] = ['high', 'medium']; // сюда попадут выбранные значения ('high', 'medium')
  riskRange: number[] = [1, 5]; // начальные значения (от 2 до 4)
  amountRange: number[] = [10000, 50000000]; // начальные значения
  ruleDescriptionOptions: any;
  selectedRules: string[] = [];

  constructor() {
  }

  ngOnInit(): void {
    const storedData = localStorage.getItem('fileResult');
    if (storedData) {
      const resultData = JSON.parse(storedData);
      this.results = resultData.results ?? [];

      this.transactionOptions = this.results.map(tx => ({
        label: `Транзакция #${tx.transaction_id}`,
        value: tx.transaction_id
      }));
      console.log(this.results);


      // const {min, max} = this.getMinMaxAmount(this.results); // results — твой массив транзакций

      // console.log('Минимальная сумма:', min);
      // console.log('Максимальная сумма:', max);
      // this.amountRange = [min, max];


      const uniqueRules = this.getUniqueRuleDescriptions(this.results); // results — твой массив транзакций
      this.ruleDescriptionOptions = uniqueRules.map(rule => ({
        label: rule,
        value: rule
      }));
    }
  }

  getUniqueRuleDescriptions(transactions: any[]): string[] {
    const allDescriptions = transactions.flatMap(tx => tx.rule_descriptions || []);
    return [...new Set(allDescriptions)];
  }

  getMinMaxAmount(transactions: Result[]): { min: number, max: number } {
    const amounts = transactions.map(tx => parseFloat(tx.analysis_details.amount.replace(/\s/g, '')));
    const min = Math.min(...amounts);
    const max = Math.max(...amounts);
    return {min, max};
  }

  onTransactionSelect(transactionId: number) {
    this.selectedTransaction = this.results.find(tx => tx.transaction_id === transactionId) ?? null;
    console.log(this.selectedTransaction);

    this.recommendationMessages = [{
      severity: 'info',
      detail: `Рекомендуется дополнительная проверка по сработавшим индикаторам.`
    }];
  }

  getPayerInfoName(payerInfo: string) {
    return `${payerInfo.split(' ')[0] || ''} ${payerInfo.split(' ')[1] || ''}`;
  }

  getPayerInfoIDN(payerInfo: string) {
    return payerInfo.split(' ')[2] || '';
  }

  submitFilter() {
    console.log('results', this.results);

    console.log('selectedRisks', this.selectedRisks);
    console.log('riskRange', this.riskRange);
    console.log('amountRange', this.amountRange);
    console.log('selectedRules', this.selectedRules);
  }
}
