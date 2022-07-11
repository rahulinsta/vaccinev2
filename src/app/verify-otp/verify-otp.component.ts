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
  pageLoader:boolean = true;
  pageMsg:string = 'Loading...';
  reCaptcha:any;
  ngOnInit(): void {
    if (!localStorage.getItem('isVerifyP')) {
      this.route.navigate(['/']);
    }
    this.verify = JSON.parse(localStorage.getItem('verificationId') || '{}');
    this.regData = JSON.parse(localStorage.getItem('regData') || '{}');
    setTimeout(()=>{
      this.pageLoader = false;
      this.pageMsg = '';
    }, 500);
    if (!firebase.apps.length) {
      firebase.initializeApp(env.firebase);
      
    }
    this.reCaptcha = new firebase.auth.RecaptchaVerifier('recaptcha-container', {size: 'invisible'}); 
    
  }


  onSubmit(f: NgForm) {
    this.isSubmit = true;
    this.isVerEOTP = false;
    this.isVerMOTP = false;
    this.message = { status: true, msg: [] }
    if (!this.emailInput.currentVal) {
      this.isSubmit = false;
      this.message.status = false;
      this.message.msg.push('Please, Enter email otp');
      return;
    }
    if (!this.mobileInput.currentVal) {
      this.isSubmit = false;
      this.message.status = false;
      this.message.msg.push('Please, Enter Mobile otp');
      return;
    }
    const eFormData = {
      "email": this.regData.email,
      "otp": this.emailInput.currentVal
    }
    this.mainService.verifyOtp(eFormData).subscribe((res: any) => {
      if (res.status) {
        this.isVerEOTP = true;
        this.sendToVerify();
      } else {
        this.isSubmit = false;
        this.isVerEOTP = false;
        this.message.msg.push(res.message); this.message.status = false;
      }
    },(err:any)=>{
      let errData = err.error.errors;
      for(let key in errData){
        this.message.msg.push(errData[key][0]);
      }
      if(errData == undefined || errData == null){
        this.message.msg.push('Something went wrong. Please try later');
      }
      this.message.status = false;
      this.isSubmit = false;  
    });
    let credential = firebase.auth.PhoneAuthProvider.credential(this.verify, this.mobileInput.currentVal);
    firebase.auth().signInWithCredential(credential)
      .then((res: any) => {
        this.isVerMOTP = true;
        this.sendToVerify();
       })
      .catch((err: any) => {
        console.log(err); this.message.msg.push(err.message); this.message.status = false;  this.isVerMOTP = false; this.isSubmit = false;
      });
  }

  sendToVerify(){
    if (this.isVerEOTP && this.isVerMOTP) {
      console.log('inner');
     this.mainService.register(this.regData).subscribe((res:any)=>{
      console.log('subscribe');
      if (res.status){
        this.message.status = true;
        this.message.msg.push(res.message);
        setTimeout(() => {
          this.message = { status: true, msg: [] };
          localStorage.removeItem('regData');
          localStorage.removeItem('verificationId');
          localStorage.removeItem('isVerifyP');
          this.isSubmit = false;  
          this.route.navigate(['/login']);
        }, 3000);
      }else{
        this.message.status = false;
        this.message.msg.push(res.message+res.data);
        setTimeout(() => {
          this.message = { status: true, msg: [] };
          this.isSubmit = false;  
        }, 3000);
      }
    },
    (err:any)=>{
      let errData = err.error.errors;
      for(let key in errData){
        this.message.msg.push(errData[key][0]);
      }
      if(errData == undefined || errData == null){
        this.message.msg.push('Something went wrong. Please try later');
      }
      this.message.status = false;
      this.isSubmit = false;  
    });
    }
  }


  resendMOTP(){
    this.pageLoader = true;
    this.pageMsg = 'Sending OTP. Please wait...';
    const num = env.DEF_CCODE + this.regData.phone;
    firebase.auth().signInWithPhoneNumber(num, this.reCaptcha).then((res:any)=>{
      localStorage.setItem('verificationId', JSON.stringify(res.verificationId));
      this.verify = res.verificationId;
      this.message.status = true;
      this.pageLoader = false;
      this.pageMsg = '';
      this.message.msg.push('OTP was resent successfully');
      setTimeout(() => {
        this.message = { status: true, msg: [] };
      }, 3000);     
    }).catch((err:any)=>{
      this.message.msg.push(err.message); this.message.status = false; 
      setTimeout(() => {
        this.message = { status: true, msg: [] };
      }, 3000);
    })
  }

  resendEOTP(){
    const formData = {
      "email" : this.regData.email
    }
    this.pageLoader = true;
    this.pageMsg = 'Sending OTP. Please wait...';
    this.mainService.sendEmailOtp(formData).subscribe((res:any) => {
      //   console.log(result);
        if(res.status){
          this.message.status = true;
          this.pageLoader = false;
          this.pageMsg = '';
          this.message.msg.push(res.message);
          setTimeout(() => {
            this.message = { status: true, msg: [] };
          }, 3000);
        }
      },
      (err:any)=>{
        let errData = err.error.errors;
        for(let key in errData){
          this.message.msg.push(errData[key][0]);
        }
        if(errData == undefined || errData == null){
          this.message.msg.push('Something went wrong. Please try later');
        }
        this.message.status = false;
        this.isSubmit = false;  
      });
  }

  // back to previous page
  editForm(){
    this.location.back();
  }
  
}
