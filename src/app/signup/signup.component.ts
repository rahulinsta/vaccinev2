import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { MainserviceComponent } from '../services/mainservice/mainservice.component';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment as env} from '../../environments/environment';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {

  isSubmitted:boolean = false
  successMsg:any;
  errmsg:any;
  formArr={phone:'',email:'', fname:'', lname:'',emgNo:'',dob:'',password:'',cpassword:'',bloodGroup:''};
  
  form = new FormGroup({
    phone: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    fname: new FormControl('', [Validators.required]),
    lname: new FormControl('', [Validators.required]),
    dob: new FormControl('', [Validators.required]),
    emgNo: new FormControl('', [Validators.required]),
    bloodGroup: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    cpassword: new FormControl('', [Validators.required]),
    
  });

  constructor(private usrObj:MainserviceComponent,private http:HttpClient) { }

  ngOnInit(): void {
  }

  get f(){
    return this.form.controls;
  }
  
  submit(){
    this.isSubmitted = true;  
    if (this.form.invalid) {  
      return  
    }  
   // console.log(this.form.value);

    this.formArr.phone = this.form.value.phone;
    this.formArr.email = this.form.value.email;
    this.formArr.fname = this.form.value.fname;
    this.formArr.lname = this.form.value.lname;
    this.formArr.dob = this.form.value.dob;
    this.formArr.emgNo = this.form.value.emgNo;
    this.formArr.bloodGroup = this.form.value.bloodGroup;
    this.formArr.password = this.form.value.password;
    this.formArr.cpassword = this.form.value.cpassword;

    this.usrObj.register(this.formArr).subscribe((data:any)=>{
      //this.isLoading = false; 
      if (data.success){
        this.successMsg = data.message;
        this.form.reset();
        //this.router.navigate(['register-verify']);
      }else{
        this.errmsg = data.message+data.data;
      }
    },
    error=> {
      this.errmsg  = 'Internal Server Error.. You Registration could not be completed.';
      //this.isLoading = false;
    });

    

    
  }


}
