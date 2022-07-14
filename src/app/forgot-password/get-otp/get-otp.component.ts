import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import firebase from 'firebase';
import { environment as env } from 'src/environments/environment';
import { MainserviceComponent } from 'src/app/services/mainservice/mainservice.component';

@Component({
  selector: 'app-get-otp',
  templateUrl: './get-otp.component.html',
  styleUrls: ['./get-otp.component.css']
})
export class GetOtpComponent implements OnInit {
  isSubmit: boolean = false;
  message: any = { status: true, msg: [] };
  verify: any;
  recoveryData:any;
  config = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: true,
  };
  pageLoader: boolean = true;
  pageMsg: string = 'Loading...';
  @ViewChild('verifyInput', { static: false }) verifyInput: any;
  reCaptcha: any;  
  constructor(private router: Router, private mainService: MainserviceComponent) { }

  ngOnInit(): void {
    if (!localStorage.getItem('recovery-data')) {
      this.router.navigate(['/login']);
    }
    var userId = localStorage.getItem('userid');
    if(userId){
      this.router.navigate(['/dashboard']);
    }
    this.recoveryData = JSON.parse(localStorage.getItem('recovery-data') || '{}');
    this.verify = JSON.parse(localStorage.getItem('verificationId') || '{}');
    setTimeout(() => {
      this.pageLoader = false;
      this.pageMsg = '';
    }, 500);
    if (!firebase.apps.length) {
      firebase.initializeApp(env.firebase);
    }
    this.reCaptcha = new firebase.auth.RecaptchaVerifier('recaptcha-container', { size: 'invisible' });
  }

  onSubmit(f: NgForm) {
    this.isSubmit = true;
    this.message = { status: true, msg: [] };
    if(!this.verifyInput.currentVal){
      this.isSubmit = false;
      this.message.status = false;
      this.message.msg.push('Please, Enter OTP');
      return;
    } 
    if(this.verifyInput.currentVal.length < 6){
      this.isSubmit = false;
      this.message.status = false;
      this.message.msg.push('Please, Enter 6 Digit OTP');
      return;
    }
    if (this.recoveryData.type === 'email') {
      const eFormData = {
        "email": this.recoveryData.username,
        "otp": this.verifyInput.currentVal
      }
      this.mainService.verifyOtp(eFormData).subscribe((res: any) => {
        if (res.status) {
          this.message = { status: true, msg: [] };
          this.router.navigate(['/recovery/reset']);
        } else {
          this.isSubmit = false;
          this.message.msg.push(res.message); this.message.status = false;
        }
      }, (err: any) => {
        let errData = err.error.errors;
        for (let key in errData) {
          this.message.msg.push(errData[key][0]);
        }
        if (errData == undefined || errData == null) {
          this.message.msg.push('Something went wrong. Please try later');
        }
        this.message.status = false;
        this.isSubmit = false;
      });
    }
    if (this.recoveryData.type === 'phone') {
      let credential = firebase.auth.PhoneAuthProvider.credential(this.verify, this.verifyInput.currentVal);
      firebase.auth().signInWithCredential(credential)
        .then((res: any) => {
          this.message = { status: true, msg: [] };
          this.router.navigate(['/recovery/reset']);
        })
        .catch((err: any) => {
          this.message.msg.push(err.message); 
          this.message.status = false; 
          this.isSubmit = false;
        });
    }
  }
  resendOTP(){
    if (this.recoveryData.type === 'email') {
      this.resendEOTP();
      return;
    } 
    if (this.recoveryData.type === 'phone') {
      this.resendMOTP();
      return;
    }
  }
  resendMOTP() {
    this.pageLoader = true;
    this.pageMsg = 'Sending OTP. Please wait...';
    const num = env.DEF_CCODE + this.recoveryData.username;
    firebase.auth().signInWithPhoneNumber(num, this.reCaptcha).then((res: any) => {
      localStorage.setItem('verificationId', JSON.stringify(res.verificationId));
      this.verify = res.verificationId;
      this.message.status = true;
      this.pageLoader = false;
      this.pageMsg = '';
      this.message.msg.push('OTP was resent successfully');
      setTimeout(() => {
        this.message = { status: true, msg: [] };
      }, 3000);
    }).catch((err: any) => {
      this.message.msg.push(err.message); this.message.status = false;
      setTimeout(() => {
        this.message = { status: true, msg: [] };
      }, 3000);
    })
  }

  resendEOTP() {
    const formData = {
      "email": this.recoveryData.username
    }
    this.pageLoader = true;
    this.pageMsg = 'Sending OTP. Please wait...';
    this.mainService.sendEmailOtp(formData).subscribe((res: any) => {
      //   console.log(result);
      if (res.status) {
        this.message.status = true;
        this.pageLoader = false;
        this.pageMsg = '';
        this.message.msg.push(res.message);
        setTimeout(() => {
          this.message = { status: true, msg: [] };
        }, 3000);
      }
    },
      (err: any) => {
        let errData = err.error.errors;
        for (let key in errData) {
          this.message.msg.push(errData[key][0]);
        }
        if (errData == undefined || errData == null) {
          this.message.msg.push('Something went wrong. Please try later');
        }
        this.message.status = false;
        this.isSubmit = false;
      });
  }

}
