import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-loader',
  templateUrl: './page-loader.component.html',
  styleUrls: ['./page-loader.component.css']
})
export class PageLoaderComponent implements OnInit {

  constructor() { }
  @Input() msg:string = 'Please Wait While data is loading.';
  ngOnInit(): void {
  }

}
