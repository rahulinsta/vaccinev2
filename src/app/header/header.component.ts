import { Component, OnInit } from '@angular/core';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  uname:any;

  constructor() { }

  ngOnInit(): void {
    var e = document.getElementById("navbar");
    this.uname = localStorage.getItem('ufname');
    console.log(this.uname);

  }

  toggleMenu(e: any) {
    // console.log(e.currentTarget);
    const btn = e.currentTarget;
    btn.getAttribute('aria-expanded') == 'false' ? btn.setAttribute('aria-expanded', "true") : btn.setAttribute('aria-expanded', "false")
    var myCollapse = document.getElementById('navbarSupportedContent')
    // return new bootstrap.Collapse(myCollapse)
    new bootstrap.Collapse(myCollapse!, {
      toggle: false
    })
  }

  addVaccine() {
    var modalId = document.querySelector("#addVaccine");
    var myModal = new bootstrap.Modal(modalId!, {
      keyboard: false
    })
    myModal.show();
  }

}
