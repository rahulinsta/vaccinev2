import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-delete',
  templateUrl: './confirm-delete.component.html',
  styleUrls: ['./confirm-delete.component.css']
})
export class ConfirmDeleteComponent implements OnInit {
  @Input() memberId :any = '';
@Output() deleteList = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  deleteData(id:any){
    this.deleteList.emit(id);
    console.log(id);
  }

}
