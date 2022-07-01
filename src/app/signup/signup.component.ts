import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators} from '@angular/forms';
import { MainserviceComponent } from '../services/mainservice/mainservice.component';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment as env} from '../../environments/environment';
import {Router} from "@angular/router"


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {

  isSubmitted:boolean = false
  isSubmit:boolean = false
  successMsg:boolean = false;
  errmsg:boolean  = false;
  emailErr:any;
  passErr1:any;
  passErr2:any;
  formArr={phone:'',email:'', fname:'', lname:'',emgNo:'',dob:'',password:'',cpassword:'',bloodGroup:'',gender:''};
  
  form = new UntypedFormGroup({
    phone: new UntypedFormControl('', [Validators.required]),
    email: new UntypedFormControl('', [Validators.required, Validators.email]),
    fname: new UntypedFormControl('', [Validators.required]),
    lname: new UntypedFormControl('', [Validators.required]),
    dob: new UntypedFormControl('', [Validators.required]),
    emgNo: new UntypedFormControl('', [Validators.required]),
    bloodGroup: new UntypedFormControl('', [Validators.required]),
    password: new UntypedFormControl('', [Validators.required]),
    cpassword: new UntypedFormControl('', [Validators.required]),
    genderType: new UntypedFormControl('', [Validators.required])
    
  });

  constructor(private usrObj:MainserviceComponent,private http:HttpClient,private router: Router) { }

  ngOnInit(): void {
    var userId = localStorage.getItem('userid');
    if(userId){
      this.router.navigate(['/login']);
    }

  }

  get f(){
    return this.form.controls;
  }
  
  submit(){
    
    this.isSubmit = true;  
    this.isSubmitted = true;  
    if (this.form.invalid) {
      this.isSubmit = false;  

      return  
    }  
    

    this.formArr.phone = this.form.value.phone;
    this.formArr.email = this.form.value.email;
    this.formArr.fname = this.form.value.fname;
    this.formArr.lname = this.form.value.lname;
    this.formArr.dob = this.form.value.dob;
    this.formArr.emgNo = this.form.value.emgNo;
    this.formArr.bloodGroup = this.form.value.bloodGroup;
    this.formArr.password = this.form.value.password;
    this.formArr.cpassword = this.form.value.cpassword;
    this.formArr.gender = this.form.value.genderType;

   
    this.usrObj.register(this.formArr).subscribe((data:any)=>{
      console.log('step-1');
      this.isSubmit = false;  
      if (data.status){
        this.successMsg = true;
        this.successMsg = data.message;
        this.form.reset();
        this.isSubmitted = false;  


        setTimeout(() => {
          this.successMsg = false;
          this.router.navigate(['/login']);
        }, 3000);

        //this.router.navigate(['register-verify']);
      }else{
        console.log('yes inside the error message');
        this.errmsg = true;
        this.errmsg = data.message+data.data;
        setTimeout(() => {
          this.errmsg = false;
        }, 3000);

        console.log(this.errmsg);
      }
    },
    error=> {
      if(error.error.errors.email){
        this.emailErr =error.error.errors.email[0]; 
      }
      
      if(error.error.errors.password){
        this.passErr1 =error.error.errors.password[0]; 
        this.passErr2 =error.error.errors.password[1]; 
      }

    
      //this.errmsg  = 'Internal Server Error.. You Registration could not be completed.';
      this.isSubmit = false;  

    });

    

    
  }


}
