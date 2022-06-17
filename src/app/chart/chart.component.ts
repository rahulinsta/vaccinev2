import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { environment as env } from '../../environments/environment';
import {Router} from "@angular/router"
import { MainserviceComponent } from '../services/mainservice/mainservice.component';

const httpOptions = {
  headers: new HttpHeaders({
    'Accept': 'application/json',
    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI3IiwianRpIjoiMDNjMDYwMmMyOTZlMGQ3ZTdjMjc4ZjM4Mzg4NjhlNDYzZTJjOWUxZGIxYjc0ZWI2NTgwZjYyOGFiMzExZGMwYjZjZjE2M2NhZDkzN2ZlYWMiLCJpYXQiOjE2NTM0NTgzNDMuODg4NzcxMDU3MTI4OTA2MjUsIm5iZiI6MTY1MzQ1ODM0My44ODg3NzM5MTgxNTE4NTU0Njg3NSwiZXhwIjoxNjg0OTk0MzQzLjg4NDE4MTk3NjMxODM1OTM3NSwic3ViIjoiMjAiLCJzY29wZXMiOltdfQ.HGUoW-LDPSOMxOdNXsoZjpeQ6ptWcPTdKsCt39iLnv0kuxtuuQ0kxlL5bzh4vt908qP3j3Nu3Ey9lC9kqDqwJIMDp_Yq70ZNnUZnQBMptgtESUXB1UiNZJSDxWvQy3dg6v02lKHHpRTaEAEXUSEnj5OXB9i-kP6L8xM4EIZybSrxQz51gLUVzr_c6I_YJ996QDteWyOrdsDsD-vSIJmEAriBs13GB5G9wRuZxeC-mZHHLVZX3Sd-vCAdVx7xJJlWb4ShDxCVXLpT9kLRgIUbgVflTlOfQHE2fl9ME1lXpau0s0npZjs4P-k-kRI9VVrdlQfIpwxPOs3w6HpUeK2iN7YlwNhP2tpxYQNjUQ2mVzXBoninTiB21Gw4jgdJH1QQsC4AXhW73wnmZ6YMtsWJbMD4w3awYKtwMXEr7emV90Ix7n7-t2607_hr9pUT8jtmcqKKKR5xvNuUPPV0eGY7M_JVJN_wlrrsrdqIIiwVEOqoyJveJxPKlixv5asuh8pgPqU65w9AGAqwHZ5GDqvXpyIaMHJcv9BDLgHcNywnDMcGKKV3r5mnM5zwHIHPNQWEf8y_FzZ1ggFLHXAUDFmwthYTYxdQD2apPQL-dQTBpxeJK7nririO0-qIiwUvXw0RZaIjRToA_iEA17Bp9MvrjoRPWVUkE0YChkamLuepQgk'
  })
}

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

  
  openPopup(track_id:any, record_id:any, el:any) {
    this.track_id = el.getAttribute('data-rocord');
    this.record_id = el.getAttribute('data-tack');

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
    //get shopclosed status
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
