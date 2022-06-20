import { Component, OnInit, ViewChild, ElementRef, NgZone, AfterViewInit} from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { environment as env } from '../../environments/environment';
import {Router} from "@angular/router"
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
  successMsg:any;
  errmsg:any;
  track_id:any;
  record_id:any;
  latitude : any;
  longitude: any;
  zoom: any;
  private geoCoder:any;
  closeResult: string = '';
  

  formArr={vcdate:'',vctime:'', vclocation:''};

  form = new FormGroup({
    vcdate: new FormControl('', [Validators.required]),
    vctime: new FormControl('', [Validators.required]),
    vclocation: new FormControl('', [Validators.required]),
  });


  constructor(private usrObj:MainserviceComponent, private http: HttpClient, 
    private el: ElementRef,private router: Router,private modalService: NgbModal) { }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userid');
    if(this.userId == null || this.userId == undefined ){
      this.router.navigate(['/login']);
    }

    this.getChartdata();

    
  }



  get f(){
    return this.form.controls;
  }

  submit(){
    this.isSubmitted = true;  
    if (this.form.invalid) {  
      return  
    } 

    this.formArr.vcdate = this.form.value.vcdate;
    this.formArr.vctime = this.form.value.vctime;
    this.formArr.vclocation = this.form.value.vclocation;
    var vcdata = {
      'vaccine_date': this.formArr.vcdate,
      'vaccine_time': this.formArr.vctime,
      'vaccine_location': this.formArr.vclocation,
      'userId': this.userId,
      'track_id': 1,
      'lat': 48.89899,
      'long': 68.49590
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


  displayStyle = "none";
  displayStyle2 = "none";
  
  openPopup(event:any) {
    this.track_id =event.currentTarget.getAttribute('data-track');
    this.record_id =event.currentTarget.getAttribute('data-record'); 
    
    console.log(this.track_id+' trid');
    console.log(this.record_id+' record_id');

    if(this.record_id == 'null'){
      console.log('yes inside the condition');
      var btn = document.getElementById('m1');
      btn?.click();

    }else{
      console.log('inelse condition');
      var btn2 = document.getElementById('m2');
      btn2?.click();
    }
    
  }
  closePopup() {
    this.displayStyle = "none";
    this.displayStyle2 = "none";
  }

  open(content:any) {

    console.log(this.chartData);
    console.log(this.record_id);

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
        //console.log();
        this.chartData.push(this.vcData.data[i].charts);
      }

      //console.log(this.chartData);

    });
  }

  getCellData(cellName: any, chartData: any, rowIndex: number, cellIndex: number) { 
    const cellCon = chartData.find((x: any) => x.month == cellName);
    const index = chartData.findIndex((x: any) => x.month == cellName);
    const currentCell = chartData[index]?.dose;
    const isSimiliarData = chartData.filter((item: any) => { return item.dose == currentCell });
    const rows = this.el.nativeElement.querySelectorAll('.table-body .rows')
    
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
        
        return 'cell schedule-yellow';
        
      } else {
        if(isSimiliarData.length > 1){
          rows[rowIndex].children[cellIndex].setAttribute('colspan', isSimiliarData.length);
          rows[rowIndex].children[cellIndex].classList.add('same-row');
        }
        rows[rowIndex].children[cellIndex].setAttribute('data-track', chartData[index]?.track_id);
        rows[rowIndex].children[cellIndex].setAttribute('data-record', chartData[index]?.record_id);
        rows[rowIndex].children[cellIndex].addEventListener('click',this.openPopup,false );
        rows[rowIndex].children[cellIndex].innerHTML = chartData[index]?.vaccine_date +'<br>' + chartData[index]?.vaccine_time;
        return 'cell schedule-active';
      }
    } else {
      return 'schedule-gray';
    }

  }

  
}
