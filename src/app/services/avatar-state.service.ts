import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AvatarSkin, AvatarSkinAvaattar } from '../avatar/avatar-options';

@Injectable({
  providedIn: 'root'
})
export class AvatarStateService {
  avatar: any = {
    seed: 'custom-seed',
    scale: 100,
    flip: false,
    size: 200,
    translateX: 5,
    translateY: 5,
    radius: 0,


    style: 'circle',
    top: ['turban'],
    topChance: 3,
    hatColor: ['blue'],
    hairColor: ['auburn'],
    facialHair: ['beardMedium'],
    facialHairChance: 3,
    facialHairColor: ['auburn'],
    clothes: ['sweater'],
    clothesColor: ['heather'],
    eyebrow: ['default'],
    mouth: ['default'],
    hair: ['mohawk'],
    eyes: ['happy'],
    accessoriesProbability: 3,
    skin: ['tanned'],
    clotheGraphics: ['skullOutline']
  }

  private skin = new BehaviorSubject<String>(AvatarSkinAvaattar.skin[0]);
  private hair = new BehaviorSubject<String>(AvatarSkinAvaattar.hair[0]);
  private hairColor = new BehaviorSubject<String>(AvatarSkinAvaattar.hairColor[0]);
  private eyes = new BehaviorSubject<String>(AvatarSkinAvaattar.eyes[0]);
  private mouth = new BehaviorSubject<String>(AvatarSkinAvaattar.mouth[0]);
  private accessoryProbability = new BehaviorSubject<Number>(AvatarSkinAvaattar.accessoriesProbability);
  private top = new BehaviorSubject<String>(AvatarSkinAvaattar.top[0]);
  private topChance = new BehaviorSubject<String>(AvatarSkinAvaattar.topChance);
  private hatColor = new BehaviorSubject<String>(AvatarSkinAvaattar.hatColor[0]);
  private facialHair = new BehaviorSubject<String>(AvatarSkinAvaattar.facialHair[0]);
  private facialHairChance = new BehaviorSubject<String>(AvatarSkinAvaattar.facialHairChance);
  private facialHairColor = new BehaviorSubject<String>(AvatarSkinAvaattar.facialHairColor[0]);
  private clothes = new BehaviorSubject<String>(AvatarSkinAvaattar.clothes[0]);
  private clothesColor = new BehaviorSubject<String>(AvatarSkinAvaattar.clothesColor[0]);
  private eyebrow = new BehaviorSubject<String>(AvatarSkinAvaattar.eyebrow[0]);
  private clotheGraphics = new BehaviorSubject<String>(AvatarSkinAvaattar.clotheGraphics[0]);


  skin_ = this.skin.asObservable();
  hair_ = this.hair.asObservable();
  hairColor_ = this.hairColor.asObservable();
  eyes_ = this.eyes.asObservable();
  mouth_ = this.mouth.asObservable();
  accessoryProbability_ = this.accessoryProbability.asObservable();
  top_ = this.top.asObservable();
  topChance_ = this.topChance.asObservable();
  hatColor_ = this.hatColor.asObservable();
  facialHair_ = this.facialHair.asObservable();
  facialHairChance_ = this.facialHairChance.asObservable();
  facialHairColor_ = this.facialHairColor.asObservable();
  clothes_ = this.clothes.asObservable();
  clothesColor_ = this.clothesColor.asObservable();
  eyebrow_ = this.eyebrow.asObservable();
  clotheGraphics_ = this.clotheGraphics.asObservable();


  constructor() { }

  /** Allows subscription to the behavior subject as an observable */


  /** Allows updating the current value of the behavior subject*/
  setSkin(val: string): void {
    this.skin.next(val);
  }
  sethair(val: string): void {
    this.hair.next(val);
    this.top.next(val)
  }
  setHairColor(val: string): void {
    this.hairColor.next(val);
  }
  setEyes(val: string): void {
    this.eyes.next(val);
  }
  setMouth(val: string): void {
    this.mouth.next(val);
  }
  setClothes(val: string): void {
    this.clothes.next(val);
  }
  setFace(val: string): void {
    this.skin.next(val);
  }


  // get the avatar object fir inital display
  getAvatar() {
    this.avatar.skinColor = [this.skin.value]
    this.avatar.hairColor = [this.hairColor.value]
    this.avatar.hair = [this.hair.value]
    this.avatar.eyes = [this.eyes.value]
    this.avatar.mouth = [this.mouth.value]
    this.avatar.skin = [this.skin.value]
    this.avatar.top = [this.top.value]

    this.avatar.accessoryProbability = [this.accessoryProbability.value]
    this.avatar.topChance = [this.topChance.value]
    this.avatar.hatColor = [this.hatColor.value]
    this.avatar.facialHair = [this.facialHair.value]
    this.avatar.facialHairChance = [this.facialHairChance.value]
    this.avatar.facialHairColor = [this.facialHairColor.value]
    this.avatar.clothes = [this.clothes.value]
    this.avatar.clothesColor = [this.clothesColor.value]
    this.avatar.eyebrow = [this.eyebrow.value]
    this.avatar.clotheGraphics = [this.clotheGraphics.value]


    return this.avatar;
  }

  getAvataar() {

  }

}
