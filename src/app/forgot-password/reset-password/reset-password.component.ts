import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MainserviceComponent } from 'src/app/services/mainservice/mainservice.component';
import { passwordMatch } from '../../signup/confirm-password.validator';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  isSubmit:boolean= false;
  isSubmitted: boolean= false;
  message: any = { status: true, msg: [] };
  recoveryData:any;
  resetForm !: FormGroup;
  pageLoader: boolean = true;
  pageMsg: string = 'Loading...';
  constructor(private router: Router, private FB: FormBuilder, private mainService: MainserviceComponent) { }

  ngOnInit(): void {
    localStorage.removeItem('verificationId');  
    if (!localStorage.getItem('recovery-data')) {
      this.router.navigate(['/login']);
    }
    var userId = localStorage.getItem('userid');
    if(userId){
      this.router.navigate(['/dashboard']);
    }
    this.recoveryData = JSON.parse(localStorage.getItem('recovery-data') || '{}');
    this.resetForm = this.FB.group({
      "password": ['', Validators.required],
      "password_confirmation": ['', Validators.required],
      "username": this.recoveryData.username
    }, { validators: [passwordMatch('password', 'password_confirmation')]}) 
    setTimeout(() => {
      this.pageLoader = false;
      this.pageMsg = '';
    }, 500);
  }

  get f() {
    return this.resetForm.controls;
  }

  onSubmit() {
    this.isSubmit = true;
    this.isSubmitted = true;
    this.message = { status: true, msg: [] };
    if(this.resetForm.invalid){
      this.isSubmit = false;
      return;
    }
    const formData = this.resetForm.value;
    this.mainService.resetPassword(formData).subscribe((res:any) =>{
      if(res.status){
        localStorage.removeItem('recovery-data');
        this.message.status = true;          
        this.message.msg.push('Your password has been changed successfully');
        setTimeout(() => {
          this.message = { status: true, msg: [] };
          this.router.navigate(['/login']);
          this.isSubmit = false;
        }, 3000);  
        
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

}
