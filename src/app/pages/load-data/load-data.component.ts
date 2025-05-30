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
  sliderValue = 0;
  apiUrl = environment.apiUrl;
  messageInfo: Message[] = [];
  messageSuccess: Message[] = [];
  fileResult: FileResultData | null = null;

  constructor(private router: Router) {
  }

  onUpload(event: any) {
    const file: File = event.files[0];

    if (!file) return;

    // Вы можете загрузить файл сюда (например, через сервис)
    console.log('Загружаемый файл:', file);
    console.log(environment.apiUrl);

    // Очистка компонента после загрузки (опционально)
    // (event.originalEvent.target as FileUpload)?.clear();
    this.processFile(file)
      .then((result: FileResult) => {
        // обработка результата
        console.log('Файл обработан:', result);
        this.fileResult = result.data;
        localStorage.setItem('fileResult', JSON.stringify(result.data));

        this.messageInfo = [{ severity: 'info', detail: `Загружено ${result.data.total_results} сообщений для анализа...` }];
        this.messageSuccess = [{ severity: 'success', detail: `Анализ завершен! Найдено ${result.data.results?.length} транзакций с рисками.` }];
      })
      .catch(error => {
        // обработка ошибок
        console.error('Ошибка обработки файла:', error);
      });
  }

  // Обработка файла
  processFile = async (file: File) => {
    const base64 = await this.fileToBase64(file);

    const response = await fetch(`${this.apiUrl}/batch`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        file_data: base64,
        settings: {
          max_transactions: 1000,
          risk_threshold: 1,
          include_low_risk: false
        }
      })
    });

    return response.json();
  };

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
