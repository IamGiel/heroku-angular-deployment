import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-abi-or',
  templateUrl: './abi-or.component.html',
  styleUrls: ['./abi-or.component.scss']
})
export class AbiOrComponent implements OnInit {
  // url: string = 'https://chat.staging.onereach.ai/GapF3hg0QZ-V3pVTbzuZQA/0fd6edi'; // abi v2
  // url: string = 'https://chat.staging.onereach.ai/GapF3hg0QZ-V3pVTbzuZQA/abi_v3'; // abi 176
  url:string = 'https://chat.staging.onereach.ai/GapF3hg0QZ-V3pVTbzuZQA/0fd6edi?loader=auto' // sandbox
  urlSafe:any;

  // window['myToken'] = this.localStorageService.retrieve('accessToken');
  constructor(private sanitizer:DomSanitizer) { }

  ngOnInit(): void {
    // localStorage.setItem('myToken', "abcdefg")
    console.log(localStorage.getItem('myToken'));
    let token:any = localStorage.getItem('myToken');
    // this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(
    //   this.url + '?token=' + encodeURIComponent(token) + '&gelsParam=' + encodeURIComponent("this is gel testing params")
    // );
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.url
    );
  }

}
