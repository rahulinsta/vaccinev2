import { Component, OnInit, ViewChild, ElementRef, NgZone, AfterViewInit} from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { UntypedFormGroup, UntypedFormControl, Validators} from '@angular/forms';
import { environment as env } from '../../environments/environment';
import {Router,ActivatedRoute} from "@angular/router"
import { MainserviceComponent } from '../services/mainservice/mainservice.component';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  @ViewChild('cmodel') cmodel:any;
  @ViewChild('closeBtn') closeBtn:any;

  vcData: any = [];
  chartData: any = [];
  isSubmitted:boolean= false;
  isSubmit: boolean = false;
  userId:any;
  memberId:any;
  successMsg:any;
  errmsg:any;
  track_id:any;
  record_id:any;
  location:any;
  vcDate:any;
  vcName:any;
  vcTime:any;
  latitude!: number;
  longitude!: number;
  zoom: any;
  pageLoader : boolean = false;
  private geoCoder:any;
  closeResult: string = '';
  imageSrc: string = '';
  httpOptions: any = {};
  maxDate:any;
  strTime:any;
  

  formArr={vcdate:'',vctime:'', vclocation:'', img:''};

  form = new UntypedFormGroup({
    vcdate: new UntypedFormControl('', [Validators.required]),
    vctime: new UntypedFormControl('', [Validators.required]),
    vclocation: new UntypedFormControl('', [Validators.required]),
    file: new UntypedFormControl(''),
    fileSource: new UntypedFormControl(''),
  });


  constructor(private usrObj:MainserviceComponent, private http: HttpClient, 
    private el: ElementRef,private router: Router,private route: ActivatedRoute,private modalService: NgbModal) { }

  ngOnInit(): void {

    if (this.getToken()) {
      this.httpOptions = {
        headers: new HttpHeaders({
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + this.getToken()
        })
      }
    }

    this.userId = localStorage.getItem('userid');
    if(this.userId == null || this.userId == undefined ){
      this.router.navigate(['/login']);
    }

    this.route.queryParams.subscribe(
      params => {
        this.memberId =  params['user'];
        if(params['user'] != undefined){
          this.userId = this.memberId;
        }
      }
    )

    this.getChartdata();
    this.getmaxDate();
    this.getCurrentTime();
    this.getLatlong();
  }


  getToken() {
    if (!!localStorage.getItem("vctoken")) {
      return localStorage.getItem("vctoken")
    } else {
      return false;
    }
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

  submit(){
    this.isSubmitted = true;  
    this.isSubmit = true; 
    if (this.form.invalid) {  
      this.isSubmit = false; 
      return  
    }
    
    var trackId = document.getElementById('hiddenspn')!.innerHTML;
   

   
    this.formArr.vcdate = this.form.value.vcdate;
    this.formArr.vctime = this.form.value.vctime;
    this.formArr.vclocation = this.form.value.vclocation;
    this.formArr.img = this.form.value.file;

    var vcdata = {
      'vaccine_date': this.formArr.vcdate,
      'vaccine_time': this.formArr.vctime,
      'vaccine_location': this.formArr.vclocation,
      'userId': this.userId,
      'track_id': trackId,
      'lat': this.latitude,
      'long': this.longitude,
      'upload_file': this.formArr.img
    }

    this.usrObj.addVaccine(vcdata).subscribe((data:any)=>{
      this.isSubmit = false; 
      if (data.status){
        this.successMsg = data.message;
        setTimeout(()=>{                         
          location.reload();
      }, 2000);
        //this.form.reset();
        //this.router.navigate(['register-verify']);
      }else{
        this.errmsg = data.message;
      }
    });



  } 


  
  openPopup(event:any) {
    this.track_id =event.currentTarget.getAttribute('data-track');
    this.record_id =event.currentTarget.getAttribute('data-record');
    this.location =event.currentTarget.getAttribute('data-location');
    this.vcName =event.currentTarget.getAttribute('data-vaccine');
    this.vcDate =event.currentTarget.getAttribute('data-date');
    this.vcTime =event.currentTarget.getAttribute('data-time');
    
    if(this.record_id == 'null'){
      //console.log('yes inside the condition');
      var btn = document.getElementById('m1');
      btn?.click();
      document.getElementById('hiddenspn')!.innerHTML = this.track_id;

    }else{
      //console.log('inelse condition');
      var btn2 = document.getElementById('m2');
      btn2?.click();
      document.getElementById('lc')!.innerHTML =this.location;
      document.getElementById('date')!.innerHTML =this.vcDate;
      document.getElementById('time')!.innerHTML =this.vcTime;
      document.getElementById('vcn')!.innerHTML =this.vcName;
    }
    
  }
  

 

  open(content:any) {

    this.form.patchValue({
      'vcdate': this.maxDate,
    })

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  } 


  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }





  getChartdata() { 
    this.pageLoader = true;
    this.http.get(env.apiurl + 'charts?userId='+this.userId, this.httpOptions).subscribe(data => {
      this.vcData = data;
      for (var i = 0; i < this.vcData.data.length; i++) {
          this.chartData.push(this.vcData.data[i].charts);
      }
      this.pageLoader = false;
    });
  }

  getCellData(cellName: any, chartData: any, rowIndex: number, cellIndex: number) { 
    const cellCon = chartData.find((x: any) => x.month == cellName);
    const index = chartData.findIndex((x: any) => x.month == cellName);
    const currentCell = chartData[index]?.dose;
    const isSimiliarData = chartData.filter((item: any) => { return item.dose == currentCell });
    const rows = this.el.nativeElement.querySelectorAll('.table-body .rows')
    var cellData:any;
    if (cellCon) {
      
   
      if (!chartData[index]?.record_id) {
        if(isSimiliarData.length > 1){
          rows[rowIndex].children[cellIndex].setAttribute('colspan', isSimiliarData.length);
          rows[rowIndex].children[cellIndex].classList.add('same-row');
         
        }
        rows[rowIndex].children[cellIndex].setAttribute('data-track', chartData[index]?.track_id);
        rows[rowIndex].children[cellIndex].setAttribute('data-record', chartData[index]?.record_id);
        rows[rowIndex].children[cellIndex].addEventListener('click',this.openPopup,false );
        rows[rowIndex].children[cellIndex].innerHTML = chartData[index]?.dose + chartData[index]?.suffix+' Dose';
        if(chartData[index]?.suffix == null){
          rows[rowIndex].children[cellIndex].innerHTML = chartData[index]?.dose;
        }
        
        if(chartData[index]?.DoseStatus == 'Taken'){
          cellData = 'cell dose-taken';
        }
        if(chartData[index]?.DoseStatus == 'overdue'){
          cellData = 'cell dose-overdue';
        }
        if(chartData[index]?.DoseStatus == 'coming'){
          cellData = 'cell dose-coming';
        }
        if(chartData[index]?.DoseStatus == 'dueOn'){
          cellData = 'cell dose-dueOn';
        } 

        //return 'cell schedule-yellow';
        return cellData;
        
      } else {
        if(isSimiliarData.length > 1){
          rows[rowIndex].children[cellIndex].setAttribute('colspan', isSimiliarData.length);
          rows[rowIndex].children[cellIndex].classList.add('same-row');
        }
        rows[rowIndex].children[cellIndex].setAttribute('data-track', chartData[index]?.track_id);
        rows[rowIndex].children[cellIndex].setAttribute('data-record', chartData[index]?.record_id);
        rows[rowIndex].children[cellIndex].setAttribute('data-location', chartData[index]?.location);
        rows[rowIndex].children[cellIndex].setAttribute('data-location', chartData[index]?.location);
        rows[rowIndex].children[cellIndex].setAttribute('data-date', chartData[index]?.vaccine_date);
        rows[rowIndex].children[cellIndex].setAttribute('data-time', chartData[index]?.vaccine_time);
        rows[rowIndex].children[cellIndex].setAttribute('data-vaccine', chartData[index]?.vaccine_name);
        rows[rowIndex].children[cellIndex].addEventListener('click',this.openPopup,false );
        rows[rowIndex].children[cellIndex].innerHTML = chartData[index]?.vaccine_date + '<br>' + chartData[index]?.vaccine_time +  '<br> <i class="h3 bi bi-check2"></i>';

        if(chartData[index]?.DoseStatus == 'Taken'){
          cellData = 'cell dose-taken';
        }
        if(chartData[index]?.DoseStatus == 'overdue'){
          cellData = 'cell dose-overdue';
        }
        if(chartData[index]?.DoseStatus == 'coming'){
          cellData = 'cell dose-coming';
        }
        if(chartData[index]?.DoseStatus == 'dueOn'){
          cellData = 'cell dose-dueOn';
        } 

        //return 'cell schedule-active';
        return cellData
        rows[rowIndex].children[cellIndex].innerHTML = '<i style="font-size:36px; line-height:30px;" class=" bi bi-check"></i>' + '<br>' + chartData[index]?.vaccine_date +'<br>' + chartData[index]?.vaccine_time;
        return 'cell schedule-active';
      }
    } else {
      return 'schedule-gray';
    }

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

  //calculate current time
  getCurrentTime() {
    var dtToday = new Date();
    var hours:any = dtToday.getHours();
    var minutes:any = dtToday.getMinutes();
    //var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 24;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    if(hours < 9){
      hours = '0'+hours;
    }
    minutes = minutes < 10 ? '0'+minutes : minutes;
    //this.strTime = hours + ':' + minutes +' '+ ampm;
    this.strTime = hours + ':' + minutes;
    console.log('currrent time');
    console.log(this.strTime);
  }

 //get the latitude and logintude

 getLatlong() {  
  if (navigator.geolocation) {  
      navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {  
          if (position) {  
              this.latitude = position.coords.latitude;  
              this.longitude = position.coords.longitude;       
          }  
      })  
  }  
}


  
}
