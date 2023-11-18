import { Component, OnInit } from '@angular/core';
import { SseHandlerService } from '../sse-handler.service';

@Component({
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.css']
})
export class PriceComponent implements OnInit {

  constructor(private sseHandler:SseHandlerService) { }

  steps=[
    {number:1, chip:false, name: "NO DRINKS" , price: 12.50},


  ]

  ngOnInit(): void {
    this.sseHandler.articleObserver.subscribe((data)=>{
      console.log(data);
      this.steps = data.filter((a)=> !a.pfand && a.tags.includes("bar")).map((a:any)=> {return {number:1, chip:false, name: a.title , price: a.price}});
    });
  }

}
