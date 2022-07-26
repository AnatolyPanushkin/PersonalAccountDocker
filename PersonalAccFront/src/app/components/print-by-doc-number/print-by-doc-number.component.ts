import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {saveAs} from "file-saver";

interface Airlines {
  name: string,
  iataCode: string
}

@Component({
  selector: 'app-print-by-doc-number',
  templateUrl: './print-by-doc-number.component.html',
  styleUrls: ['./print-by-doc-number.component.css']
})
export class PrintByDocNumberComponent implements OnInit {

  constructor(private http: HttpClient) { }

  airlines: Airlines[] | any;

  public printByDocNumber(){
    (<HTMLDivElement>document.getElementById('loader')).style.display = '';
    const options: {
      headers?: HttpHeaders;
      observe?: 'body';
      params?: HttpParams;
      reportProgress?: boolean;
      responseType: 'arraybuffer';
      withCredentials?: boolean;
    } = {
      responseType: 'arraybuffer'
    };
    
    
    var doc_number = (<HTMLInputElement>document.querySelector("#by_doc_number_input")).value;
    console.log(doc_number)
    var airline_companies = (<HTMLSelectElement>document.getElementById("airlines_select_doc"));
    var airline_company = airline_companies.options[airline_companies.selectedIndex].value
    console.log(airline_company)
     return this.http.post("https://localhost:5001/v1/transactions/by_doc_number_print",{
      DocNumber: doc_number,
      AirlineCompanyIataCode : airline_company
     }, options)
     .subscribe(data =>{
      console.log(data)
      const blob = new Blob([data], {type: 'text/xlsx;charset=utf-8'});
      const fileName = airline_company + 'TransactionReport.xlsx';
      console.log(fileName);
      saveAs(blob,fileName);
      (<HTMLDivElement>document.getElementById('loader')).style.display = '';
      }
      )
}

  ngOnInit(){
    this.http.post("https://localhost:5001/v1/transactions/get_all_airlines",{},{headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  }).subscribe(data => {
      console.log(data);
      this.airlines = data;
    })
  }

}
