import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { observable, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SseHandlerService {

  UserStatsObserv:Observable<Userstats>
  UserStatsDJS:Observable<DJs>
  UserStatsInfos:Observable<Infos>
  Entry:Observable<boolean>
  rolltextObserv:Observable<string[]>
  articleObserver:Observable<Article[]>

  constructor(private http: HttpClient) {
    console.log("constructed");
    let eventSource = new EventSource("https://app.silentparty-hannover.de/api/realtime");
    let that = this;
    eventSource.addEventListener("PB_CONNECT",function(e:any){
      console.log(e.lastEventId);
        that.http.post("https://app.silentparty-hannover.de/api/realtime", {subscriptions: ["marquee","djs","userstats","shop_items"],clientId:e.lastEventId}).subscribe((data:any)=>{
        console.log(data);
      });
    });


    eventSource.addEventListener("marquee",(e:any)=>console.log(JSON.parse(e.data)));

    this.UserStatsObserv = new Observable((observer) => {
      eventSource.addEventListener("userstats",(e:any)=>observer.next(JSON.parse(e.data)));
    });
    this.UserStatsDJS = new Observable((observer) => {

      eventSource.addEventListener("djs",(e:any)=>observer.next(JSON.parse(e.data) ));
    });
    this.UserStatsInfos = new Observable((observer) => {
      eventSource.addEventListener("infos",(e:any)=>observer.next(JSON.parse(e.data)));
    });
    this.Entry = new Observable((observer) => {
      eventSource.addEventListener("entry",(e:any)=>observer.next(JSON.parse(e.data).entry));
    });
    this.rolltextObserv = new Observable((observer) => {
      eventSource.addEventListener("marquee",(e:any)=>observer.next(JSON.parse(e.data).map((a:any)=>a.text) ));
    });
    this.articleObserver = new Observable((observer) => {
      eventSource.addEventListener("shop_items",(e:any)=>observer.next(JSON.parse(e.data)));
    });
  }


  updateDJS(djs:DJs){
      for(let dj of djs){
        let id = ("000000000000000"+ dj.color).slice(-15);
        delete (dj as any).id;
    	  this.http.patch("https://app.silentparty-hannover.de/api/djs/"+ id ,dj).subscribe();
      }
  }
  updateBanner(banner:string[]){
    //this.http.post("https://api.sp/rolltext",banner).subscribe();
  }

  refreshAll(){
  }


}

export interface Userstats{
  sells:number,
  checked:number,
  returned:number,
  current:number
}
export interface Infos{
  rollbanner:string[],
  info:string,
  panic:string,
}

export interface Article{
  title:string,
  tags:string[],
  price:number,
  pfand:boolean
}
export interface DJ{
  music:string,
  name:string,
  instagram:string,
  color:string
}
export type DJs = DJ[];
