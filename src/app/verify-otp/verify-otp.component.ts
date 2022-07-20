import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import firebase from 'firebase';
import { environment as env } from 'src/environments/environment';
import { MainserviceComponent } from '../services/mainservice/mainservice.component';
@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.css']
})
export class VerifyOtpComponent implements OnInit {
  constructor(private route: Router, private mainService: MainserviceComponent, private location: Location) { }

  @ViewChild('emailInput', { static: false }) emailInput: any;
  @ViewChild('mobileInput', { static: false }) mobileInput: any;
  isSubmit: boolean = false;
  regData: any;
  verify: any;
  config = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: true,
  };
  config2 = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: true,
  };
  message: any = { status: true, msg: [] };
  isVerMOTP: boolean = false;
  isVerEOTP: boolean = false;
  pageLoader: boolean = true;
  pageMsg: string = 'Loading...';
  reCaptcha: any;
  display:string = '';
  isActResend:boolean = false;
  interval :any;
  isSuccss: boolean = false;
  ngOnInit(): void {
    if (!localStorage.getItem('isVerifyP')) {
      this.route.navigate(['/']);
    }
    this.verify = JSON.parse(localStorage.getItem('verificationId') || '{}');
    this.regData = JSON.parse(localStorage.getItem('regData') || '{}');
    setTimeout(() => {
      this.pageLoader = false;
      this.pageMsg = '';
      this.timer(1);
    }, 500);
    if (!firebase.apps.length) {
      firebase.initializeApp(env.firebase);
    }
    this.reCaptcha = new firebase.auth.RecaptchaVerifier('recaptcha-container', { size: 'invisible' });
  }

  onSubmit(f: NgForm) {
    this.isSubmit = true;
    this.isVerEOTP = false;
    this.isVerMOTP = false;
    this.message = { status: true, msg: [] };
    this.isSuccss = false;
    // if (this.regData.email) {
    //   if (!this.emailInput.currentVal) {
    //     this.isSubmit = false;
    //     this.message.status = false;
    //     this.message.msg.push('Please, Enter email otp');
    //     return;
    //   }      
    // }
    if (!this.mobileInput.currentVal) {
      this.isSubmit = false;
      this.message.status = false;
      this.message.msg.push('Please, Enter Mobile otp');
      return;
    }
    // if (this.regData.email) {
    //   const eFormData = {
    //     "email": this.regData.email,
    //     "otp": this.emailInput.currentVal
    //   }
    //   this.mainService.verifyOtp(eFormData).subscribe((res: any) => {
    //     if (res.status) {
    //       this.isVerEOTP = true;
    //       this.sendToVerify();
    //     } else {
    //       this.isSubmit = false;
    //       this.isVerEOTP = false;
    //       this.message.msg.push(res.message); this.message.status = false;
    //     }
    //   }, (err: any) => {
    //     let errData = err.error.errors;
    //     for (let key in errData) {
    //       this.message.msg.push(errData[key][0]);
    //     }
    //     if (errData == undefined || errData == null) {
    //       this.message.msg.push('Something went wrong. Please try later');
    //     }
    //     this.message.status = false;
    //     this.isSubmit = false;
    //   });
    // } else {
    //   this.isVerEOTP = true;
    //   this.sendToVerify();
    // }
    let credential = firebase.auth.PhoneAuthProvider.credential(this.verify, this.mobileInput.currentVal);
    firebase.auth().signInWithCredential(credential)
      .then((res: any) => {
        this.isVerMOTP = true;
        this.isVerEOTP = true;
        this.sendToVerify();
      })
      .catch((err: any) => {
        // console.log(err); 
        this.message.msg.push(err.message); 
        this.message.status = false; 
        this.isVerMOTP = false; 
        this.isVerEOTP = false;
        this.isSubmit = false;
        this.isActResend = true;
        clearInterval(this.interval);
      });
  }

  sendToVerify() {
    if (this.isVerEOTP && this.isVerMOTP) {
      this.mainService.register(this.regData).subscribe((res: any) => {
        if (res.status) {         
          this.isSuccss = true;
          this.isSubmit = false;
          localStorage.removeItem('regData');
          localStorage.removeItem('verificationId');
          localStorage.removeItem('isVerifyP');          
        } else {
          this.message.status = false;
          this.message.msg.push(res.message + res.data);
          setTimeout(() => {
            this.message = { status: true, msg: [] };
            this.isSubmit = false;
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


  resendMOTP() {
    this.pageLoader = true;
    this.pageMsg = 'Sending OTP. Please wait...';
    const num = this.regData.phone_no;
    this.message = { status: true, msg: [] };
    firebase.auth().signInWithPhoneNumber(num, this.reCaptcha).then((res: any) => {
      localStorage.setItem('verificationId', JSON.stringify(res.verificationId));
      this.verify = res.verificationId;
      this.message.status = true;
      this.pageLoader = false;
      this.pageMsg = '';
      this.isActResend= false;      
      this.timer(1);
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
      "email": this.regData.email
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

  // back to previous page
  editForm() {
    this.location.back();
  }

  timer(minute:number){
    this.display = '';
    let seconds: number = minute * 60;
    let textSec: any = "0";
    let statSec: number = 60;

    const prefix = minute < 10 ? "0" : "";
    this.interval = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = "0" + statSec;
      } else textSec = statSec;

      this.display = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

      if (seconds == 0) {
        // console.log("finished");
        this.isActResend = true;
        clearInterval(this.interval);
      }
    }, 1000);
  }

}
