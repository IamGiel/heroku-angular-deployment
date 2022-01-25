import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isMobile = false;
  constructor() { }

  ngOnInit(): void {
  }

  openNavMenu(){
    console.log("clicked open nav");
    this.isMobile = !this.isMobile;
  }

}
