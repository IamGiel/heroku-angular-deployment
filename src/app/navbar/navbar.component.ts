import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isMobile = false;
  isEn:any = '';
  constructor() { }

  ngOnInit(): void {
  }

  openNavMenu(){
    console.log("clicked open nav");
    this.isMobile = !this.isMobile;
  }

  isActive(en:any){
    console.log(en)
    this.isEn = en;
  }

}
