import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MainserviceComponent } from 'src/app/services/mainservice/mainservice.component';
import firebase from 'firebase';
import { environment as env } from 'src/environments/environment';
import { Router } from '@angular/router';
import { SearchCountryField, CountryISO } from 'ngx-intl-tel-input';
@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css']
})
export class ForgotComponent implements OnInit {

  isSubmit : boolean = false;
  isSubmitted: boolean = false;
  forgotForm !: FormGroup;
  emailRegex = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  switchClass = "phone";
  message: any = { status: true, msg: [] };
  reCaptchaVerifier:any;  
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.India];
  maxLength:any = 15;
  constructor(private FB:  FormBuilder, private mainService: MainserviceComponent, private router: Router) { }

  ngOnInit(): void {
    localStorage.removeItem('recovery-data');
    localStorage.removeItem('verificationId');   
    var userId = localStorage.getItem('userid');
    if(userId){
      this.router.navigate(['/dashboard']);
    } 
    this.forgotForm = this.FB.group({
      'type':'phone',
      "username": [null, [Validators.required]],
    })
    if (!firebase.apps.length) {
      firebase.initializeApp(env.firebase);
    }
    this.reCaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {size: 'invisible'})
  }

  get f() {
    return this.forgotForm.controls;
  }

  submit(){
    this.message = { status: true, msg: [] };
    this.isSubmit = true;
    this.isSubmitted = true;
    if (this.forgotForm.invalid) {
      this.isSubmit = false;
      return
    }
    const PhoneNum: any = this.forgotForm.value.username;
    const formData = this.forgotForm.value;
    if(this.switchClass === 'phone'){
      formData.username = PhoneNum?.e164Number;
    }   
    this.mainService.identify(formData).subscribe((res:any) =>{
      if(res.status){
        localStorage.setItem('recovery-data', JSON.stringify(formData));
        this.message.status = true;          
        this.message.msg.push('Sending... OTP'); 
        if(formData?.type === 'phone'){
          const num = formData?.username;
          this.sendOTPToPhone(num);
        }   
        if(formData?.type === 'email'){
          const emailData = {
            "email" : formData?.username
          }
          this.sendOTPToEMail(emailData);
        }   
        // this.isSubmit = false;
      } else{
        this.message.status = false;          
        this.message.msg.push(res?.message);          
        this.isSubmit = false;
      }
    },(err:any)=>{
        // console.error("Error: ",err);
        let errData = err.error.message;        
        if(errData == undefined || errData == null){
          this.message.msg.push('Something went wrong. Please try later');
        } else{
          this.message.msg.push(errData);
        }
        this.message.status = false;
        this.isSubmit = false;  
    });
  }

  // getTypeVal
  getTypeVal(e:any){
    const inputVal = e.target.value;
    this.isSubmitted = false;
    this.message = { status: true, msg: [] };
    this.forgotForm.reset();
    if(inputVal === 'email'){
      this.switchClass = 'email';
      this.forgotForm.get('type')?.setValue('email');
      this.forgotForm.controls['username'].setValidators([Validators.pattern(this.emailRegex), Validators.required]);
      this.forgotForm.controls['username'].updateValueAndValidity();      
      return;
    }
    if(inputVal === 'phone'){
      this.switchClass = 'phone';
      this.forgotForm.get('type')?.setValue('phone');
      this.forgotForm.controls['username'].setValidators([Validators.required]);
      this.forgotForm.controls['username'].updateValueAndValidity();
      return;
    }
  }

  sendOTPToPhone(num:any){
    firebase.auth().signInWithPhoneNumber(num, this.reCaptchaVerifier).then(result => {
      localStorage.setItem('verificationId', JSON.stringify(result.verificationId));
      this.isSubmit = false;
      this.message = { status: true, msg: [] };
      this.router.navigate(['/recovery/verify']);
    }).catch(error => {
        // console.error('Error :', error);
        this.message = { status: true, msg: [] };
        this.isSubmit = false;
        this.message.status = false;
        if(error.code === "auth/invalid-phone-number"){
          this.message.msg.push('The phone number provided is incorrect. ')
        } else{
          this.message.msg.push(error?.message)
        }
    });
  }

  sendOTPToEMail(email:any){
    this.mainService.sendEmailOtp(email).subscribe((res:any) => {
        if(res.status){
          this.isSubmit = false;
          this.message = { status: true, msg: [] };
          this.router.navigate(['/recovery/verify']);
        } else{
          this.message.status = false;          
          this.message.msg.push(res?.message);          
          this.isSubmit = false;
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
