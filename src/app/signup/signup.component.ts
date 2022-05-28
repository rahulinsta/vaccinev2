import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {

  isSubmitted:boolean = false
  formArr={phone:'',email:'', fname:'', lname:'',emgNo:'',dob:'',password:'',bloodGroup:''};
  
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

  constructor() { }

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
    console.log(this.form.value);

    this.formArr.phone = this.form.value.phone;
    this.formArr.email = this.form.value.email;
    this.formArr.fname = this.form.value.fname;
    this.formArr.lname = this.form.value.lname;
    this.formArr.dob = this.form.value.dob;
    this.formArr.emgNo = this.form.value.emgNo;
    this.formArr.bloodGroup = this.form.value.bloodGroup;
    this.formArr.password = this.form.value.password;
    
  }


}
