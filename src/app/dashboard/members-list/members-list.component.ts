import { Component, OnInit } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment as env } from '../../../environments/environment';
import { MainserviceComponent } from '../../services/mainservice/mainservice.component';
import {Router} from "@angular/router"
import { DatePipe } from '@angular/common';
import { FormGroup, FormControl, UntypedFormGroup, UntypedFormControl, Validators} from '@angular/forms';

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
  isSubmitted:boolean = false;
  isSubmittedMeb:boolean = false;
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
  memberId:any;
  mesgClass:any = 'hide';
  pageLoader: boolean = false;
  isSubmit: boolean = false;


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


  constructor(private router: Router,private http: HttpClient,
    private usrObj:MainserviceComponent,private datePipe: DatePipe) {

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
    this.memberId = id;
    var editMemData:any = [];

    this.http.get(env.apiurl + 'member/edit/'+id, httpOptions).subscribe(data => {
      editMemData = data;
      var mebDob = editMemData.data.dob;
      var newdate = mebDob.split("-").reverse().join("-");
      var mdob = this.datePipe.transform(newdate,"yyyy-MM-dd");
      this.editMemberfrm.patchValue({
          'fname': editMemData.data.first_name,
          'mname': editMemData.data.middle_name,
          'lname': editMemData.data.last_name,
          'dob': newdate,
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
      const file = event.target.files[0];
      
        this.form.patchValue({
          fileSource: file
        });
    
     
    
    }
  }


  get f(){
    return this.form.controls;
  }

  get f2(){
    return this.editMemberfrm.controls;
  }

  submit(){
    this.isSubmit = true;   
    this.isSubmitted = true;  
    if (this.form.invalid) { 
      this.isSubmit = false;   
      return ;
      
    }  

  
    const formData = new FormData();
    formData.append('member_image', this.form.value.fileSource);
    formData.append('fname', this.form.value.fname);
    formData.append('mname', this.form.value.mname);
    formData.append('lname', this.form.value.lname);
    formData.append('dob', this.form.value.dob);
    formData.append('gender', this.form.value.genderType);
    formData.append('blood_group', this.form.value.bloodGroup);
    formData.append('is_member', '1');
    
   
    this.usrObj.addMember(formData).subscribe((data:any)=>{
      //this.isLoading = false; 
      this.isSubmit = false;     
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
    this.http.get(env.apiurl + 'member', httpOptions).subscribe(data => {
        this.members = data;
        console.log('memebeers');
        console.log(this.members.data);
    
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
    });

  }

  //update memberprofile
  editFrmSubmit(){
    this.isSubmit = true;
    this.isSubmittedMeb = true;  
    if (this.editMemberfrm.invalid) {  
      this.isSubmit = false;
      return  
    }

     
    var memberUpdateData = {
      'fname': this.editMemberfrm.value.fname,
      'mname': this.editMemberfrm.value.mname,
      'lname': this.editMemberfrm.value.lname,
      'dob': this.editMemberfrm.value.dob,
      'gender': this.editMemberfrm.value.gender,
      'blood_group': this.editMemberfrm.value.bloodGroup,
      "is_member" : 1,
    }
   
    this.usrObj.updateMember(memberUpdateData,this.memberId).subscribe((data:any)=>{
      //this.isLoading = false; 
      this.isSubmit = false;
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

      this.usrObj.deleteMember(id).subscribe((data:any)=>{
        //this.isLoading = false; 
        console.log(data);

        if (data.status){
          this.successMsg = data.message;
          this.mesgClass = 'show';
          setTimeout(()=>{                         
            location.reload();
          }, 2000);
        }else{
          this.errmsg = data.message+data.data;
        }
      });

  }


}


