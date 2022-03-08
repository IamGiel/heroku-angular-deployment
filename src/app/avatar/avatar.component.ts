import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { color, createAvatar } from '@dicebear/avatars';
import * as bsStyle from '@dicebear/big-smile';
import { AvatarSkin, ClotheTypes, EyeTypes, HairColorTypes, HairTypes, MouthTypes, SkinTypes } from './avatar-options';

import ColorPicker from 'simple-color-picker';
import { reduce } from 'rxjs';
import { AvatarStateService } from '../services/avatar-state.service';

import * as avatarStyle from '@dicebear/avatars-avataaars-sprites';



@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent implements OnInit, AfterViewInit {
  @ViewChild('iframe')
  iframe!: ElementRef;

  selectedIndexMouth:any;
  selectedIndexEyes:any;
  selectedIndexClothes:any;
  selectedIndexHair:any;
  selectedIndexSkin:any
  selectedIndexHairColor:any;

  svg: SafeHtml | undefined;
  colorPicker = new ColorPicker();
  color:any;
  colorHair:any = "none";
  selectedColor= "Select a color";

  avatarSvg:any;
  subscription:any;
  eyeTypes = EyeTypes;
  skinTypes = SkinTypes;
  mouthTypes = MouthTypes;
  clotheTypes = ClotheTypes;
  hairTypes = HairTypes;
  hairColorTypes = HairColorTypes;

  constructor(private sanitizer: DomSanitizer, private avatarService:AvatarStateService) {}

  ngOnInit() {
    this.createDefaultAvatar();
  }
  ngAfterViewInit(): void {
  }

  createDefaultAvatar(){
    console.log(this.avatarService.getAvatar())
    this.avatarSvg = createAvatar(avatarStyle, this.avatarService.getAvatar());
    this.svg = this.sanitizer.bypassSecurityTrustHtml(this.avatarSvg);
  }

  selectSkin(val:any){
    console.log(val);
    this.color = val;
    this.avatarService.setSkin(val);
    this.createDefaultAvatar();
  }
  selecthairColor(val:any){
    console.log(val);
    this.colorHair = val
    this.avatarService.setHairColor(val);
    console.log(this.avatarService.getAvatar())
    this.createDefaultAvatar();
  }
  selectEyeBtn(eye:string, idx:number){
    console.log(eye);
    this.avatarService.setEyes(eye);
    this.selectedIndexEyes = idx;
    this.createDefaultAvatar();
  }
  selectSkinBtn(skin:string, idx:number){
    console.log(skin);
    this.avatarService.setSkin(skin);
    this.selectedIndexSkin = idx
    this.createDefaultAvatar();
  }
  selectMouthBtn(mouth:string, idx:number){
    console.log(mouth);
    this.avatarService.setMouth(mouth);
    this.selectedIndexMouth = idx;
    this.createDefaultAvatar();
  }
  selectClothesBtn(clothes:string, idx:number){
    console.log(clothes);
    this.avatarService.setClothes(clothes);
    this.selectedIndexClothes = idx;
    this.createDefaultAvatar();
  }
  selectHairBtn(hair:string, idx:number){
    console.log(hair);
    this.avatarService.sethair(hair);
    this.selectedIndexHair = idx;
    this.createDefaultAvatar();
  }
  selectHairColorBtn(hair:string, idx:number){
    console.log(hair);
    this.avatarService.setHairColor(hair);
    this.selectedIndexHairColor = idx;
    this.createDefaultAvatar();
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
