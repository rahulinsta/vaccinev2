import { Component, OnInit } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment as env } from '../../../environments/environment';
import { MainserviceComponent } from '../../services/mainservice/mainservice.component';
import {Router} from "@angular/router"
import { UntypedFormGroup, UntypedFormControl, Validators} from '@angular/forms';

var vcToken = localStorage.getItem('vctoken');
const httpOptions = {
  headers: new HttpHeaders({
    'Accept': 'application/json',
    'Authorization': 'Bearer '+vcToken
  })
}

@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.css']
})

export class MembersListComponent implements OnInit {
  uname: any;
  userId:any;

  members:any = [];
  isSubmitted:boolean = false
  isSubmittedMeb:boolean = false
  successMsg:any;
  errmsg:any;
  imageSrc: string = '';
  isSubmittedVc:any;
  memfName:any;
  memmName:any;
  memlName:any;
  memBloodGroup:any;
  memGender:any;
  memDob:any;
  pageLoader: boolean = false;


  form = new UntypedFormGroup({
    fname: new UntypedFormControl('', [Validators.required]),
    mname: new UntypedFormControl(''),
    lname: new UntypedFormControl('', [Validators.required]),
    dob: new UntypedFormControl('', [Validators.required]),
    bloodGroup: new UntypedFormControl(''),
    genderType: new UntypedFormControl('',[Validators.required]),
    file: new UntypedFormControl(''),
    fileSource: new UntypedFormControl(''),
  });

  editMemberfrm = new UntypedFormGroup({
    fname: new UntypedFormControl('', [Validators.required]),
    mname: new UntypedFormControl(''),
    lname: new UntypedFormControl('', [Validators.required]),
    dob: new UntypedFormControl('', [Validators.required]),
    bloodGroup: new UntypedFormControl(''),
    gender: new UntypedFormControl('',[Validators.required]),
  });


  constructor(private router: Router,private http: HttpClient,private usrObj:MainserviceComponent) {

   }

  ngOnInit(): void {
    this.uname = localStorage.getItem('ufname');

    this.userId = localStorage.getItem('userid');
    if(this.userId == null || this.userId == undefined ){
      this.router.navigate(['/login']);
    }

    this.getMembers();

  }

  addMember() {
    var modalId = document.querySelector("#addMember");
    var myModal = new bootstrap.Modal(modalId!, {
      keyboard: false
    })
    myModal.show();
  }

  editMember(id:any) {
    console.log(id);
    var editMemData:any = [];

    this.http.get(env.apiurl + 'member/edit/'+id, httpOptions).subscribe(data => {
      editMemData = data;
      this.editMemberfrm.patchValue({
          'fname': editMemData.data.first_name,
          'mname': editMemData.data.middle_name,
          'lname': editMemData.data.last_name,
          'dob': editMemData.data.dob,
          'gender': editMemData.data.gender,
          'bloodGroup': editMemData.data.blood_group
      });


    });


    var modalId = document.querySelector("#editMember");
    var myModal = new bootstrap.Modal(modalId!, {
      keyboard: false
    })
    myModal.show();
  }


  onFileChange(event:any) {
    const reader = new FileReader();
     
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
     
      reader.onload = () => {
    
        this.imageSrc = reader.result as string;
      
        this.form.patchValue({
          fileSource: reader.result
        });
    
      };
    
    }
  }


  get f(){
    return this.form.controls;
  }

  get f2(){
    return this.editMemberfrm.controls;
  }

  submit(){
    this.isSubmitted = true;  
    if (this.form.invalid) {  
      return  
    }  

    
    
    var memberData = {
      'fname': this.form.value.fname,
      'mname': this.form.value.mname,
      'lname': this.form.value.lname,
      'dob': this.form.value.dob,
      'gender': this.form.value.genderType,
      'blood_group': this.form.value.bloodGroup,
      "is_member" : 1,
      'upload_file': this.form.value.file
    }
   
    this.usrObj.addMember(memberData).subscribe((data:any)=>{
      //this.isLoading = false; 
      if (data.status){
        this.successMsg = data.message;
        setTimeout(()=>{                         
          location.reload();
      }, 2000);
      }else{
        this.errmsg = data.message+data.data;
      }
    });
  }

  // get members

  getMembers(){
    this.pageLoader = true;
    this.http.get(env.apiurl + 'member', httpOptions).subscribe((data:any) => {
       
      
      this.members = data.data.sort((a: any, b: any) => {
        if (a.id === this.userId) {
          return -1;
        };
        if (b.id === this.userId) {
          return 1;
        };
        return a.id < b.id ? -1 : 1;
      });
        //console.log(this.members.data);
      this.pageLoader = false;
    });
    

  }

  //update memberprofile
  editFrmSubmit(){
    this.isSubmittedMeb = true;  
    if (this.editMemberfrm.invalid) {  
      return  
    }

     
    var memberUpdateData = {
      'fname': this.editMemberfrm.value.fname,
      'mname': this.editMemberfrm.value.mname,
      'lname': this.editMemberfrm.value.lname,
      'dob': this.editMemberfrm.value.dob,
      'gender': this.editMemberfrm.value.genderType,
      'blood_group': this.editMemberfrm.value.bloodGroup,
      "is_member" : 1,
    }
   
    this.usrObj.addMember(memberUpdateData).subscribe((data:any)=>{
      //this.isLoading = false; 
      if (data.status){
        this.successMsg = data.message;
        setTimeout(()=>{                         
          location.reload();
      }, 2000);
      }else{
        this.errmsg = data.message+data.data;
      }
    });


  }

  //delete member
  deleteMember(id:any){
      console.log(id);
  }


}


