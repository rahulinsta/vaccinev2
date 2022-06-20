import { Component, OnInit, ViewChild, ElementRef, NgZone, AfterViewInit} from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { environment as env } from '../../environments/environment';
import {Router} from "@angular/router"
import { MainserviceComponent } from '../services/mainservice/mainservice.component';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
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
  

  formArr={vcdate:'',vctime:'', vclocation:''};

  form = new FormGroup({
    vcdate: new FormControl('', [Validators.required]),
    vctime: new FormControl('', [Validators.required]),
    vclocation: new FormControl('', [Validators.required]),
  });


  constructor(private usrObj:MainserviceComponent, private http: HttpClient, 
    private el: ElementRef,private router: Router) { }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userid');
    if(this.userId == null || this.userId == undefined ){
      this.router.navigate(['/login']);
    }

    this.getChartdata();
  }

  
  ngAfterViewInit() {
    this.el.nativeElement.querySelector('.cell')
                                  .addEventListener('click', this.onClick.bind(this));
  }
  
  onClick(e:any) {
    console.log('onclcke');
    console.log(e);
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
      'track_id': 9,
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
        console.log('yes inside the error message');
        this.errmsg = data.message;
        //console.log(this.errmsg);
      }
    });



  } 


  displayStyle = "none";
  displayStyle2 = "none";
  
  openPopup(el:any) {
    console.log('yes1');
    return;
    this.record_id = el.getAttribute('data-rocord');
    this.track_id = el.getAttribute('data-track');

    console.log(el);
    console.log(this.track_id+'trid');
    console.log(this.record_id+'recrdid');

    if(this.record_id == null || this.record_id == undefined){
      this.displayStyle = "block";
    }else{
      this.displayStyle2 = "block";
    }
    
  }
  closePopup() {
    this.displayStyle = "none";
    this.displayStyle2 = "none";
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
      console.log(this.vcData.data);

      for (var i = 0; i < this.vcData.data.length; i++) {
        //console.log();
        this.chartData.push(this.vcData.data[i].charts);
      }

      //console.log(this.chartData);

    });
  }

  getCellData(cellName: any, chartData: any, rowIndex: number, cellIndex: number) {

    // console.log('cellName'+cellName);
    // console.log('chartData'+chartData);
    // console.log('rowIndex'+rowIndex);
    // console.log('cellName'+cellName);
    
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
        rows[rowIndex].children[cellIndex].setAttribute('data-rocord', chartData[index]?.record_id);
        //rows[rowIndex].children[cellIndex].addEventListener('onclick', this.openPopup(chartData[index]?.record_id));
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
        rows[rowIndex].children[cellIndex].setAttribute('data-rocord', chartData[index]?.record_id);
        rows[rowIndex].children[cellIndex].innerHTML = chartData[index]?.vaccine_date +'<br>' + chartData[index]?.vaccine_time;
        return 'cell schedule-active';
      }
    } else {
      return 'schedule-gray';
    }

  }

}
