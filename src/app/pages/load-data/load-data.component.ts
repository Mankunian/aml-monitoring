import {Component} from '@angular/core';
import {FileUpload, FileUploadModule} from "primeng/fileupload";
import {HttpClientModule} from "@angular/common/http";
import {SliderModule} from "primeng/slider";
import {FormsModule} from "@angular/forms";
import {environment} from "../../../environments/environment";
import {Message} from "primeng/api";
import {FileResult, FileResultData} from "../../helper/interface";
import {NgIf} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-load-data',
  standalone: true,
  imports: [
    FileUploadModule,
    HttpClientModule,
    SliderModule,
    FormsModule,
    NgIf
  ],
  templateUrl: './load-data.component.html',
  styleUrl: './load-data.component.scss'
})
export class LoadDataComponent {
  maxFileSize = 200 * 1024 * 1024; // 200 MB
  sliderValue = 1;
  apiUrl = environment.apiUrl;
  messageInfo: Message[] = [];
  messageSuccess: Message[] = [];
  fileResult: FileResultData | null = null;
  isUploading = false; // добавить в компонент
  selectedFile: File | null = null;

  constructor(private router: Router) {
  }

  onUpload(event: any) {
    const file: File = event.files[0];
    this.selectedFile = file;

    if (!file) return;

    localStorage.removeItem('fileResult'); // очищаем старые данные


    this.isUploading = true; // запуск спиннера
    console.log('Загружаемый файл:', file);


    this.processFile(file)
      .then((result: any) => {
        console.log('Файл обработан:', result);
        this.fileResult = result.data;

        if (!result.success) {
          return;
        }

        localStorage.setItem('fileResult', JSON.stringify(result.data));

        this.messageInfo = [{
          severity: 'info',
          detail: `Загружено ${result.data.total_results} сообщений для анализа...`
        }];

        this.messageSuccess = [{
          severity: 'success',
          detail: `Анализ завершен! Найдено ${result.data.results?.length} транзакций с рисками.`
        }];
      })
      .catch(error => {
        console.error('Ошибка обработки файла:', error);
        this.messageInfo = [{
          severity: 'error',
          detail: 'Ошибка при загрузке или анализе файла.'
        }];
        localStorage.removeItem('fileResult'); // очищаем старые данные
      })
      .finally(() => {
        this.isUploading = false; // выключаем спиннер

        // очищаем p-fileUpload (если нужно)
        if (event?.originalEvent?.target?.clear) {
          event.originalEvent.target.clear();
        }
      });
  }

  // Обработка файла
  processFile = async (file: File): Promise<any> => {
    const text = await file.text();
    const json = JSON.parse(text);
    console.log(json);

    // Предположим, что файл содержит { transactions: [...] }
    const transactions: any[] = json.transactions || json;

    if (!Array.isArray(transactions)) {
      throw new Error('Файл не содержит транзакций');
    }

    const CHUNK_SIZE = 25;
    const results: any[] = [];

    for (let i = 0; i < transactions.length; i += CHUNK_SIZE) {
      const chunk = transactions.slice(i, i + CHUNK_SIZE);

      try {
        const response = await fetch(`${this.apiUrl}/batch`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            transactions: chunk,
            chunk_index: Math.floor(i / CHUNK_SIZE),
            total_chunks: Math.ceil(transactions.length / CHUNK_SIZE),
            settings: {
              max_transactions: 1000,
              risk_threshold: 1,
              include_low_risk: false
            }
          })
        });

        const result = await response.json();
        if (result.success) {
          results.push(...result.results);
        } else {
          console.error('Ошибка от API:', result);
        }

        // ⏱️ Пауза между запросами (опционально)
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Ошибка обработки чанка ${Math.floor(i / CHUNK_SIZE)}:`, error);
      }
    }

    return {
      error: undefined, message: "", success: false, timestamp: "",
      data: {
        total_results: results.length,
        results: results,
        summary: {},
        statistics: {}
      }
    };

  };

  // processFile = async (file: File) => {
  //   const base64 = await this.fileToBase64(file);
  //
  //   const response = await fetch(`${this.apiUrl}/batch`, {
  //     method: 'POST',
  //     headers: {'Content-Type': 'application/json'},
  //     body: JSON.stringify({
  //       file_data: base64,
  //       settings: {
  //         max_transactions: 1000,
  //         risk_threshold: 1,
  //         include_low_risk: false
  //       }
  //     })
  //   });
  //
  //   return response.json();
  // };

  fileToBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      // @ts-ignore
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = error => reject(error);
    });
  };

  goStats() {
    this.router.navigate(['/statistics'], {
      state: { data: this.fileResult }
    });

  }

}
