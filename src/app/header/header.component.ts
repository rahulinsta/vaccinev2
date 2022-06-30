import { Component, OnInit } from '@angular/core';
import { MainserviceComponent } from '../services/mainservice/mainservice.component';
import {Router} from "@angular/router"
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  uname:any;
  pageUrl:any = '';
 

  constructor(private usrObj:MainserviceComponent,private router: Router) { }

  ngOnInit(): void {
    var e = document.getElementById("navbar");
    this.uname = localStorage.getItem('ufname');
    //console.log(this.uname);
    this.pageUrl = this.router.url;
    // console.log(this.router.url)
  }

  logout(){
    //console.log('yes logout');
    this.usrObj.logout();
    localStorage.clear();
    this.router.navigate(['/login']);
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
    var modalId = document.querySelector("#addVaccineStep1");
    var myModal = new bootstrap.Modal(modalId!, {
      keyboard: false
    })
    myModal.show();
  }

 

}
