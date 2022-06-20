import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  uname:any;

  constructor() { }

  ngOnInit(): void {

    this.uname = localStorage.getItem('ufname');
    console.log(this.uname);

  }

}
