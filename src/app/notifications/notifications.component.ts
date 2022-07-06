import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  uname: any;
  pageLoader: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.uname = localStorage.getItem('ufname');

  }

}
