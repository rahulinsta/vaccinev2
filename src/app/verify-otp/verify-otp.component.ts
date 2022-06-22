import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.css']
})
export class VerifyOtpComponent implements OnInit {
  constructor() { }

  @ViewChild('ngOtpInput', { static: false }) ngOtpInput: any;

  otp: any = '';
  config = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
  };

  ngOnInit(): void {
  }

  onOtpChange(otp:any) {
    this.otp = otp;
  }

}
