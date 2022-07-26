import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DataAll } from '../models/fromBack/DataAll';
import { ByTicketNumber } from '../models/toBack/ByTicketNumber';
import { Input} from '@angular/core';

@Component({
  selector: 'app-search-by-ticket-number',
  templateUrl: './search-by-ticket-number.component.html',
  styleUrls: ['./search-by-ticket-number.component.css']
})
export class SearchByTicketNumberComponent implements OnInit {
  @Output() ticketNumber = new EventEmitter<any>();
  @Output() noTicketSearch = new EventEmitter<boolean>()
  public byTicketNumber?: ByTicketNumber;
  public dataAlls?: DataAll[];
  constructor(private http: HttpClient) { };

  public clearDocNumberInput(){
    return (<HTMLInputElement>document.getElementById('by_doc_number_input')).value = '';
  }

  public getByTicketNumber(){
    this.noTicketSearch.emit(false);
    (<HTMLDivElement>document.getElementById('loader')).style.display = '';
    var ticket_number = (<HTMLInputElement>document.querySelector("#by_ticket_number_input")).value;
    console.log(ticket_number)
    if(!ticket_number.match("^[a-zA-Z0-9]{13}")){
      (<HTMLDivElement>document.getElementById('loader')).style.display = 'none';
      return (<HTMLDivElement>document.getElementById('wrong_number_message')).style.display = '';
    }
    var allTicketCheckbox = (<HTMLInputElement>document.getElementById("by_ticket_number_checkbox")).checked;
     return this.http.post("https://localhost:5001/v1/transactions/by_ticket_number",{
      TicketNumber: ticket_number,
      ByTicketNumberCheckBox: allTicketCheckbox
     }, {headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  })
     .subscribe(
      
      data => {
        if (Object.keys(data).length == 0) {
          this.noTicketSearch.emit(true);
          (<HTMLDivElement>document.getElementById('loader')).style.display = 'none';
          
        } else {
          this.ticketNumber.emit(data);
          (<HTMLDivElement>document.getElementById('wrong_number_message')).style.display = 'none';
          (<HTMLDivElement>document.getElementById('loader')).style.display = 'none';
          (<HTMLTableElement>document.getElementById('ticket_table')).style.display = '';
          (<HTMLDivElement>document.getElementById('print_by_ticket_number_div')).style.display = '';
        }
      }
    );
    }
  ngOnInit(): void {
  }

}
