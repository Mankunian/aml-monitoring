import {Component, OnInit} from '@angular/core';
import {CommonModule, Location} from "@angular/common";
import {FileResultData, Result} from "../../helper/interface";
import {TableModule} from "primeng/table";
import {Button} from "primeng/button";
import {DropdownModule} from "primeng/dropdown";
import {FormsModule} from "@angular/forms";
import {MessagesModule} from "primeng/messages";
import {Message} from "primeng/api";
import {InputTextareaModule} from "primeng/inputtextarea";
import {PanelModule} from "primeng/panel";

@Component({
  selector: 'app-detailed-analysis',
  standalone: true,
  imports: [CommonModule, TableModule, Button, DropdownModule, FormsModule, MessagesModule, InputTextareaModule, PanelModule],
  templateUrl: './detailed-analysis.component.html',
  styleUrl: './detailed-analysis.component.scss'
})
export class DetailedAnalysisComponent implements OnInit {
  results: Result[] = [];
  selectedTransactionId: number | null = null;
  selectedTransaction: Result | null = null;
  transactionOptions: any;
  recommendationMessages: Message[] = [];

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
    }
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
}
