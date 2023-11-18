import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DJ, DJs, SseHandlerService } from '../sse-handler.service';

@Component({
  selector: 'app-djform',
  templateUrl: './djform.component.html',
  styleUrls: ['./djform.component.css']
})
export class DjformComponent implements OnInit {

  form = new FormGroup({
      blue: new FormGroup({
        name: new FormControl("", Validators.required),
        instagram: new FormControl("", Validators.required),
        music: new FormControl("", Validators.required)
      }),
      green: new FormGroup({
        name: new FormControl( "", Validators.required),
        instagram: new FormControl( "", Validators.required),
        music: new FormControl("", Validators.required)
      }),
      red: new FormGroup({
        name: new FormControl("", Validators.required),
        instagram: new FormControl("", Validators.required),
        music: new FormControl("", Validators.required)
      })

  });

  constructor(private sse:SseHandlerService) { }
  reset(){
    this.sse.UserStatsDJS.subscribe((data:DJs)=>{
      let patchData:any = {};
      console.log(data);
      for(let i=0;i<Math.min(3,data.length);i++){
        patchData[data[i].color] = data[i];
      }
      this.form.patchValue(patchData);
    });
  }
  ngOnInit(): void {
    this.reset();
  }
  error = false;
  onSubmit(){
    if(!this.form.valid){
      this.error = true;
      return;
    }
    this.error = false;
    let rot:DJ = this.form.value["red"];
    rot.color = "red";
    let grun:DJ = this.form.value["green"];
    grun.color = "green";
    let blau:DJ = this.form.value["blue"];
    blau.color = "blue";
    this.sse.updateDJS([rot,grun,blau]);

  }

}
