import { Component, OnInit } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment as env } from '../../../environments/environment';
import { MainserviceComponent } from '../../services/mainservice/mainservice.component';
import {Router} from "@angular/router"
import { DatePipe } from '@angular/common';
import { FormGroup, FormControl, UntypedFormGroup, UntypedFormControl, Validators} from '@angular/forms';
declare var $: any;
// var vcToken = localStorage.getItem('vctoken');
// const httpOptions = {
//   headers: new HttpHeaders({
//     'Accept': 'application/json',
//     'Authorization': 'Bearer '+vcToken
//   })
// }

@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.css']
})

export class MembersListComponent implements OnInit {
  uname: any;
  userId:any;

  deleteId:any;
  
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
  profileImage:any;
  httpOptions:any={};

  // set modalID
  modalId = 'memDelModalPopup';

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
    file: new UntypedFormControl(''),
    fileSource: new UntypedFormControl(''),
  });


  constructor(private router: Router,private http: HttpClient,
    private usrObj:MainserviceComponent,private datePipe: DatePipe) {

   }

  ngOnInit(): void {

    if (this.getToken()) {
      this.httpOptions = {
        headers: new HttpHeaders({
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + this.getToken()
        })
      }
    }

    this.uname = localStorage.getItem('ufname');

    this.userId = localStorage.getItem('userid');
    if(this.userId == null || this.userId == undefined ){
      this.router.navigate(['/login']);
    }

    this.getMembers();

  }


  // get token function
  getToken() {
    if (!!localStorage.getItem("vctoken")) {
      return localStorage.getItem("vctoken")
    } else {
      return false;
    }
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

    this.http.get(env.apiurl + 'member/edit/'+id, this.httpOptions).subscribe(data => {
      editMemData = data;
      var mebDob = editMemData.data.dob;
      this.profileImage = editMemData.data.profile_image;
      var newdate = mebDob.split("-").reverse().join("-");
      var mdob = this.datePipe.transform(newdate,"yyyy-MM-dd");
      this.editMemberfrm.patchValue({
          'fname': editMemData.data.first_name,
          'mname': editMemData.data.middle_name,
          'lname': editMemData.data.last_name,
          'dob': newdate,
          'gender': editMemData.data.gender,
          'member_image' : editMemData.data.profile_image,
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

  oneditFileChange(event:any) {
    const reader = new FileReader();
     
    if(event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      
        this.editMemberfrm.patchValue({
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
        this.form.reset();
        this.isSubmitted = false;  
        setTimeout(()=>{                         
          // location.reload();
          this.successMsg=false;
          this.closeModal('addMember');
          this.getMembers();
      }, 2000);
      }else{
        this.errmsg = data.message+data.data;
      }
    });
  }

  // get members

  getMembers(){
    this.pageLoader = true;
    
    this.http.get(env.apiurl + 'member', this.httpOptions).subscribe((data:any) => {
       
      
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
    this.isSubmit = true;
    this.isSubmittedMeb = true;  
    if (this.editMemberfrm.invalid) {  
      this.isSubmit = false;
      return  
    }

    //console.log(this.editMemberfrm.value);
   // return;

     
    var memberUpdateData = {
      'fname': this.editMemberfrm.value.fname,
      'mname': this.editMemberfrm.value.mname,
      'lname': this.editMemberfrm.value.lname,
      'dob': this.editMemberfrm.value.dob,
      'gender': this.editMemberfrm.value.gender,
      'blood_group': this.editMemberfrm.value.bloodGroup,
      "is_member" : 1,
      'member_image': this.editMemberfrm.value.fileSource
    }

    // const formData = new FormData();
    // formData.append('member_image', this.editMemberfrm.value.fileSource);
    // formData.append('fname', this.editMemberfrm.value.fname);
    // formData.append('mname', this.editMemberfrm.value.mname);
    // formData.append('lname', this.editMemberfrm.value.lname);
    // formData.append('dob', this.editMemberfrm.value.dob);
    // formData.append('gender', this.editMemberfrm.value.genderType);
    // formData.append('blood_group', this.editMemberfrm.value.bloodGroup);
    // formData.append('is_member', '1');

   
    this.usrObj.updateMember(memberUpdateData,this.memberId).subscribe((data:any)=>{
      //this.isLoading = false; 
      this.isSubmit = false;
      if (data.status){
        this.successMsg = data.message;
        setTimeout(()=>{ 
          this.successMsg = false;                        
          this.closeModal('editMember');
          this.getMembers()
      }, 2000);
      }else{
        this.errmsg = data.message+data.data;
      }
    });


  }

  

  removeDataModl(id:any) {
    var modalId = document.querySelector("#confirmDelete");
    var myModal = new bootstrap.Modal(modalId!, {
      keyboard: false
    })
    myModal.show();
    this.deleteId = id; 
  }

  closeModal(id: any) {
    var closeModalId = document.querySelector(`#${id}`);
    var myModal = bootstrap.Modal.getOrCreateInstance(closeModalId!)
    myModal.hide();
  }
  //delete member
  deleteMember(){
    this.isSubmit = true; 
    // console.log(this.deleteId);
    // this.closeModal('confirmDelete');
    //  return;
    this.usrObj.deleteMember(this.deleteId).subscribe((data:any)=>{
        this.isSubmit = false; 
        // console.log(data);

        if (data.status){
          // debugger;
          this.successMsg = data.message;
          this.closeModal('confirmDelete');
         this.getMembers();
          this.deleteId = '';
          this.successMsg = false;                        

          // var modalId = document.querySelector("#confirmDelete");
         
        }else{
          this.errmsg = data.message+data.data;
        }
      });

  }


}


