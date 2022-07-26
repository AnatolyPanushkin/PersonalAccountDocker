import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';

interface Airlines {
  name: string,
  iataCode: string
}

@Component({
  selector: 'app-print-by-ticket-number',
  templateUrl: './print-by-ticket-number.component.html',
  styleUrls: ['./print-by-ticket-number.component.css']
})
export class PrintByTicketNumberComponent implements OnInit {

  constructor(private http: HttpClient) { }

  airlines: Airlines[] | any;

  
  public printByTicketNumber(){
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

  
    var ticket_number = (<HTMLInputElement>document.querySelector("#by_ticket_number_input")).value;
    console.log(ticket_number)
    var airline_companies = (<HTMLSelectElement>document.getElementById("airlines_select_number"));
    var airline_company = airline_companies.options[airline_companies.selectedIndex].value
    console.log(airline_company)
    if(!ticket_number.match("^[a-zA-Z0-9]{13}")){
      (<HTMLDivElement>document.getElementById('no_ticket_for_doc_message')).style.display = 'none';
      return (<HTMLDivElement>document.getElementById('wrong_number_message')).style.display = '';
    }
    var allTicketCheckbox = (<HTMLInputElement>document.getElementById("by_ticket_number_checkbox")).checked;
    return this.http.post("https://localhost:5001/v1/transactions/by_ticket_number_print",{
      TicketNumber: ticket_number,
      ByTicketNumberCheckBox: allTicketCheckbox,
      AirlineCompanyIataCode : airline_company
     }, options)
     .subscribe(data =>{
      console.log(data);
      const blob = new Blob([data], {type: 'text/xlsx;charset=utf-8'});
      const fileName = airline_company + 'TransactionsReport.xlsx';
      console.log(fileName);
      saveAs(blob,fileName);
      (<HTMLDivElement>document.getElementById('loader')).style.display = 'none';
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
