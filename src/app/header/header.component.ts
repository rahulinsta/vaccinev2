import { Component, OnInit } from '@angular/core';
import { MainserviceComponent } from '../services/mainservice/mainservice.component';
import {Router} from "@angular/router"

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  uname:any;

  constructor(private usrObj:MainserviceComponent,private router: Router) { }

  ngOnInit(): void {

    this.uname = localStorage.getItem('ufname');
    console.log(this.uname);

  }

  logout(){
    console.log('yes logout');
    this.usrObj.logout();
    localStorage.clear();
    this.router.navigate(['/login']);
  }

}
