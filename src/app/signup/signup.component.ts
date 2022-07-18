import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MainserviceComponent } from '../services/mainservice/mainservice.component';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment as env } from '../../environments/environment';
import { Router } from "@angular/router";
import { passwordMatch } from './confirm-password.validator';
import firebase from 'firebase';
import { SearchCountryField, CountryISO } from 'ngx-intl-tel-input';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {

  isSubmitted: boolean = false
  isSubmit: boolean = false
  successMsg: boolean = false;
  errmsg: boolean = false;
  emailErr: any;
  passErr1: any;
  passErr2: any;
  emailRegex = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  reCaptchaVerifier: any;
  isSendMOTP: boolean = false;
  isSendEOTP: boolean = false;
  formArr = {};
  maxDate: any;
  message: any = { status: true, msg: [] };
  maxLength: any = 15;
  form = new FormGroup({
    phone_no: new FormControl('', [Validators.required]),
    email: new FormControl(''),
    fname: new FormControl('', [Validators.required]),
    lname: new FormControl('', [Validators.required]),
    mname: new FormControl(''),
    dob: new FormControl('', [Validators.required]),
    emergency_number: new FormControl(''),
    blood_group: new FormControl(''),
    password: new FormControl('', [Validators.required]),
    password_confirmation: new FormControl('', [Validators.required]),
    gender: new FormControl('', [Validators.required])
  },
    [passwordMatch('password', 'password_confirmation')]
  );

  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.India];
  constructor(private usrObj: MainserviceComponent, private http: HttpClient, private router: Router) {
    localStorage.removeItem('regData');
    localStorage.removeItem('verificationId');
    localStorage.removeItem('isVerifyP');
    localStorage.removeItem('recovery-data');
    localStorage.removeItem('verificationId');
  }

  ngOnInit(): void {
    var userId = localStorage.getItem('userid');
    this.getmaxDate();
    this.form.patchValue({
      'dob': this.maxDate
    });

    if (userId) {
      this.router.navigate(['/login']);
    }
    if (!firebase.apps.length) {
      firebase.initializeApp(env.firebase);
    }
    // this.formArr = JSON.parse(localStorage.getItem('regData') || '{}');
    // if(this.formArr){
    //   this.form.patchValue(this.formArr);
    // }
    this.reCaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', { size: 'invisible' })
  }

  get f() {
    return this.form.controls;
  }

  submit() {
    this.message = { status: true, msg: [] };
    this.isSubmit = true;
    this.isSubmitted = true;
    if (this.form.invalid) {
      this.isSubmit = false;
      return
    }
    const PhoneNum: any = this.form.value.phone_no;
    const formData = this.form.value;
    formData.phone_no = PhoneNum?.e164Number;
   
    this.usrObj.validateRegForm(formData).subscribe((res: any) => {
      if (res.status) {
        localStorage.setItem('regData', JSON.stringify(formData));
        if (this.form.value.phone_no) {
          const num = PhoneNum?.e164Number;
          firebase.auth().signInWithPhoneNumber(num, this.reCaptchaVerifier).then(result => {
            localStorage.setItem('verificationId', JSON.stringify(result.verificationId));
            this.isSendMOTP = true;
            this.isSendEOTP = true;
            this.sendToVerify();
          }).catch(error => {
            // console.error('Error :', error);
            this.isSendEOTP = false;
            this.isSendEOTP = false;
            this.isSubmit = false;
            this.message.status = false;
            if (error.code === "auth/invalid-phone-number") {
              this.message.msg.push('The phone number provided is incorrect. ')
            } else {
              this.message.msg.push(error?.message)
            }
            this.sendToVerify();
          });
        }
      } else {
        this.message.status = false;
        this.message.msg.push(res?.message);
        this.isSendEOTP = false;
      }
      this.sendToVerify()
    }, (err: any) => {
      let errData = err.error.errors;
      for (let key in errData) {
        this.message.msg.push(errData[key][0]);
      }
      if (errData == undefined || errData == null) {
        this.message.msg.push('Something went wrong. Please try later');
      }
      this.message.status = false;
      this.isSendEOTP = false;
      this.isSubmit = false;
    });

  }

  sendToVerify() {
    if (this.isSendEOTP && this.isSendMOTP) {
      localStorage.setItem('isVerifyP', 'true');
      this.isSubmit = false;
      this.router.navigate(['verify-otp']);

    }
  }

  //calculate maxdate

  getmaxDate() {
    var dtToday = new Date();

    var month: any = dtToday.getMonth() + 1;
    var day: any = dtToday.getDate();
    var year: any = dtToday.getFullYear();

    if (month < 10)
      month = '0' + month.toString();
    if (day < 10)
      day = '0' + day.toString();

    this.maxDate = year + '-' + month + '-' + day;

  }




}
