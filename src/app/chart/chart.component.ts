import { Component, OnInit, ViewChild, ElementRef, NgZone, AfterViewInit} from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FormGroup, FormControl, Validators} from '@angular/forms';
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
  latitude : any;
  longitude: any;
  zoom: any;
  private geoCoder:any;
  closeResult: string = '';
  imageSrc: string = '';
  

  formArr={vcdate:'',vctime:'', vclocation:'', img:''};

  form = new FormGroup({
    vcdate: new FormControl('', [Validators.required]),
    vctime: new FormControl('', [Validators.required]),
    vclocation: new FormControl('', [Validators.required]),
    file: new FormControl(''),
    fileSource: new FormControl(''),
  });


  constructor(private usrObj:MainserviceComponent, private http: HttpClient, 
    private el: ElementRef,private router: Router,private route: ActivatedRoute,private modalService: NgbModal) { }

  ngOnInit(): void {
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
        //console.log(this.memberId);
      }
    )


    this.getChartdata();
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
    if (this.form.invalid) {  
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
      'lat': 48.89899,
      'long': 68.49590,
      'upload_file': this.formArr.img
    }

    
    this.usrObj.addVaccine(vcdata).subscribe((data:any)=>{
      //this.isLoading = false; 
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

    //console.log(this.chartData);
    //console.log(this.record_id);

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
    var vcToken = localStorage.getItem('vctoken');
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': 'Bearer '+vcToken
      })
    }

    this.http.get(env.apiurl + 'charts?userId='+this.userId, httpOptions).subscribe(data => {
      this.vcData = data;
      //console.log(this.vcData.data);

      for (var i = 0; i < this.vcData.data.length; i++) {
        //console.log(this.vcData.data[i].charts);
        
          this.chartData.push(this.vcData.data[i].charts);
      }
    
    //console.log('this.chartData');
    //console.log(this.chartData);

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
        rows[rowIndex].children[cellIndex].innerHTML = chartData[index]?.vaccine_date +'<br>' + chartData[index]?.vaccine_time;

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

  
}
