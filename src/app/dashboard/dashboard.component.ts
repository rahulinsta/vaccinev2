import { Component, OnInit } from '@angular/core';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  openInfo(e: any) {

    var myCollapse = document.getElementById('user--info')
    new bootstrap.Collapse(myCollapse!);
    e.classList.toggle('open')
  }

  addVaccine() {
    var modalId = document.querySelector("#addVaccine");
    var myModal = new bootstrap.Modal(modalId!, {
      keyboard: false
    })
    myModal.show();
  }

}
