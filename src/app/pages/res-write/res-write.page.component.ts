import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
@Component({
  templateUrl: './res-write.page.component.html',
  styleUrls: ['./res-write.page.component.scss']
})
export class ResWritePageComponent implements OnInit {

  constructor(private router:Router,
    private route:ActivatedRoute) { }

  ngOnInit() {
    this.route.params.forEach((params)=>{
      this.topic=params["id"];
    });

    this.route.queryParams.forEach((params)=>{
      if(params["reply"]){
        this.reply=params["reply"];
      }else{
        this.reply=null;
      }
    });
  }

  close(){
    this.router.navigate(['topic',this.topic]);
  }

  topic:string;
  reply:string|null;

}