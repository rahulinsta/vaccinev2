import { Component, OnInit } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment as env } from '../../../environments/environment';
import { MainserviceComponent } from '../../services/mainservice/mainservice.component';
import {Router} from "@angular/router"
import { DatePipe } from '@angular/common';
import { FormGroup, FormControl, UntypedFormGroup, UntypedFormControl, Validators} from '@angular/forms';
declare var $: any;


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
  maxDate:any;
  showcls:any='none';

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
    phone: new UntypedFormControl(''),
    email: new UntypedFormControl(''),
    emgNo: new FormControl('')

  });


  constructor(private router: Router,private http: HttpClient,
    private usrObj:MainserviceComponent,private datePipe: DatePipe) {

   }

  ngOnInit(): void {

    console.log(this.maxDate);

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
    this.getmaxDate();

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
    this.form.patchValue({
      'dob': this.maxDate
    })
    var modalId = document.querySelector("#addMember");
    var myModal = new bootstrap.Modal(modalId!, {
      keyboard: false
    })
    myModal.show();
  }

  editMember(id:any) {
    this.memberId = id;
    var editMemData:any = []; 
    if(this.userId == id){
      this.showcls = "block";
    }else{
      this.showcls = "none";
    }

    this.http.get(env.apiurl + 'member/edit/'+id, this.httpOptions).subscribe(data => {
      editMemData = data;
      var mebDob = editMemData.data.dob;
      console.log(editMemData);
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
          'bloodGroup': editMemData.data.blood_group,
          'phone': editMemData.data.phone_no,
          'email': editMemData.data.email,
          'emgNo': editMemData.data.emergency_contact,

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

        reader.onload = () => {

          this.profileImage = reader.result as string;
     
        }
     
        reader.readAsDataURL(file)


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

    var mName = this.form.value.mname;
    if(mName == 'null' || mName == null){
      mName = '';
    }
  
    const formData = new FormData();
    formData.append('member_image', this.form.value.fileSource);
    formData.append('fname', this.form.value.fname);
    formData.append('mname', mName);
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
    //return;

    var mName = this.editMemberfrm.value.mname;
    var memail = this.editMemberfrm.value.email;
    var memgNo = this.editMemberfrm.value.emgNo;
    if(mName == 'null' || mName == null){
      mName = '';
    }
    if(memail == 'null' || memail == null){
      memail = '';
    }
    if(memgNo == 'null' || memgNo == null){
      memgNo = '';
    }
   
    const formData = new FormData();
    formData.append('member_image', this.editMemberfrm.value.fileSource);
    formData.append('fname', this.editMemberfrm.value.fname);
    formData.append('mname',  mName);
    formData.append('lname', this.editMemberfrm.value.lname);
    formData.append('dob', this.editMemberfrm.value.dob);
    formData.append('gender', this.editMemberfrm.value.gender);
    formData.append('blood_group', this.editMemberfrm.value.bloodGroup);
    formData.append('phone_no', this.editMemberfrm.value.phone);
    formData.append('email', memail);
    formData.append('emergency_number', memgNo);
    formData.append('is_member', '1');
    formData.append('_method', 'PUT');

   
    this.usrObj.updateMember(formData,this.memberId).subscribe((data:any)=>{
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

//calculate maxdate

  getmaxDate(){
    var dtToday = new Date();
  
    var month:any = dtToday.getMonth() + 1;
    var day:any = dtToday.getDate();
    var year:any = dtToday.getFullYear(); 
  
    if(month < 10)
        month = '0' + month.toString();
    if(day < 10)
        day = '0' + day.toString();
  
     this.maxDate = year + '-' + month + '-' + day;    
    
  }


}


