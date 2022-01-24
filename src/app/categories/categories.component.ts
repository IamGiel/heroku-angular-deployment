import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService, Category, CategoryResult } from '../services/categories.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
declare var require: any

let levenshtein = require('fast-levenshtein');

interface CategoryPayload {
  offset:string;
  limit:string;
  name:string;
  period:string;
  guidance:string;
  gradeID:string;
  region:string;
  grade:string

}
interface TopAnswers {
  answer: string;
  answerId: string;
  type: string;
  score: number;
  contextId: string;
  context: string;
}
interface Entities {
  id: string;
  value: string;
  entity: string;
  endPos: number;
  role: string;
  startPos: number;
}

interface NluResponse {
  question:string;
  answer:string;
  answerId:string;
  type:string;
  contextId:string;
  context:string;
  luisId:string;
  topAnswers:TopAnswers[];
  entities:Entities[];
  targetQuestion:string;
  confidence:number;
  tokenizedText:string[];
}

interface NLUResult {
  result:NluResponse;
}


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  count = 0;
  offset = 0;
  limit =  3237;
  name =  "";
  period =  "";
  guidance =  "";
  grade_id = "";
  region = "";
  regionList:any = [];
  categoryList:any = [];
  grade = "";
  userInput = '';
  // name: "Carbon Steel", period: "Feb-22", guidance: "Delivered Eastern China Domestic"
  guidance_dropdown = [];
  gradeid_dropdown = [];
  hasChange: boolean = false;
  categories: Category[] = [];
  result:any = null;
  appId = '4597897d-addf-46cd-9849-87a123cf7e26';
  kbId = 'PgrzMKQsHIq0PkkBzCxqN';
  nlpData: any;
  lvscore:number = Infinity;

  payload:any = {};
  score:any;

  // reactive response
  checkif_priceIntent:any = false;
  cat_name:any = '';
  reg_name:any = '';



  profileForm = this.fb.group({
    categoryName: [''],
    period: [''],
    guidance: [''],
    gradeID: [''],
    region:[''],
    grade: ['']
    // region: ['',Validators.required]
    // ,
    // aliases: this.fb.array([
    //   this.fb.control('')
    // ])
  });
  // kbId = "PgrzMKQsHIq0PkkBzCxqN"; //PgrzMKQsHIq0PkkBzCxqN
  // appId = "4597897d-addf-46cd-9849-87a123cf7e26";
  nluForm = this.fb.group({
    user_input: ['', Validators.required],
    kbid: [{value: 'PgrzMKQsHIq0PkkBzCxqN', disabled: true}, Validators.required],
    appid: [{value:'4597897d-addf-46cd-9849-87a123cf7e26', disabled:true}, Validators.required]

  });
  isLoading:any = false;
  entities:any = [];

  constructor(
    private route:ActivatedRoute,
    private categoriesService:CategoriesService,
    private fb: FormBuilder,
  ) {
   }

  ngOnInit(): void {
    this.updateAllRegions()
    // updateAllCategoryNames()
    this.updateAllCategoryNames()
    this.nluForm.valueChanges.subscribe(onchange=>{
      // console.log(onchange)
      if(onchange.user_input.length <= 0){
        this.isLoading = true;
        console.log("1")
      } else {
        this.isLoading = false;
      }
    })
  }

  lavenshtein(wordA:string, wordB:string){
    let distance = levenshtein.get(wordA, wordB);
    // console.log(distance)
    return distance;
  }

  async updateCategories() {
    // this.isLoading = true;
    console.log("2")
    const result = await this.categoriesService.getCategories(this.offset,this.limit,this.name,this.period,this.guidance, this.grade_id, this.region, this.grade);

    if(result){
      // this.isLoading = false;
      console.log("3")
      this.result = result.data.categories.category;
    }
    if(this.result.length <= 0){
      this.searchAgain()
    }
    // this.getGuidanceDropdown(result)
    // this.getGradeeDropdown(result)
    console.log("result >>>> ", result)
  }

  async updateCategoriesWithNLUData() {
    this.checkif_priceIntent = false;
    this.cat_name = null;
    this.reg_name = null;
    this.entities = null;
    this.result = null;
    // this.nlpData = null;
    let entities = this.nlpData?.result?.entities;
    const region_fields:any = [
      ''
    ]
    const calculate = (array?:[], val?:any) => {
      let minL = Infinity;
      let result:any;
      let currentL;
      let o:any = {};
      console.log("this array ", array)
      if(array && array.length){
        array.forEach((element:any) => {
          let db_string = element.toLowerCase().replace(/[^a-zA-Z]/g, "");
          let user_string = val.toLowerCase().replace(/[^a-zA-Z]/g, "");
          currentL = this.lavenshtein(db_string, user_string);
          if(db_string.includes(user_string)){
            // console.log('string exist!')
            // result = val
            minL = currentL;
          } else {
            // console.log('did not exist ', db_string, ' and >>> ', user_string )
               if(currentL <= 4 && currentL < minL){
              minL = currentL;
            }
          }
          o[element] = currentL;
        });

        // this goes through the keys of o, and returns the key with the lowest score
        let key = Object.keys(o).reduce((key, v) => o[v] < o[key] ? v : key);
        console.log(key, o[key])

        result = {
          "key":key,
          "score":minL

        }

      }

      return result;
    }
    let entityObj:any = {
      "RegionEntity":{array:this.regionList, assign:(val:any)=>{this.reg_name = val},score:null},
      "geographyV2":{array:this.regionList, assign:(val:any)=>{this.reg_name = val},score:null},
      "CategoryListEntity":{array:this.categoryList, assign:(val:any)=>{this.cat_name = val},score:null}
    };

    if(entities && entities.length){
      entities.forEach((k:any)=> {

        if(k.entity in entityObj){
          const res:any = calculate(entityObj[k.entity].array, k.value)
          console.log(res)
          if(res){
            console.log(res,entityObj)
            entityObj[k.entity].assign(res.key)
            entityObj[k.entity].score = res.score;
          }
        }

        if(k.entity == "PriceKeyWordEntity"){
          alert("price")
          this.checkif_priceIntent = true;
        }
      })

      const result = await this.categoriesService.getCategories(this.offset,this.limit,this.cat_name,this.period,this.guidance, this.grade_id, this.reg_name, this.grade);
      console.log(result)
      if(result){
        console.log("4" , entityObj)
        this.result = result.data.categories.category;
        this.payload.category = {"name":this.cat_name, "score":entityObj["CategoryListEntity"].score};
        this.payload.region ={"name":this.reg_name, "score":entityObj["RegionEntity"].score?entityObj["RegionEntity"].score:entityObj["geographyV2"].score}
        this.payload.priceIntent = this.checkif_priceIntent;
        // console.log(this.payload)
      } else {
        alert('err')
        console.log("5")
      }
    }




  }

  async updateAllRegions(){
    // let regions_array:any = [];
    const result = await this.categoriesService.getRegions(this.offset, this.limit, '');
    // console.log(result)


    // **** misuse of map here, since map reutrns an array
    // result.map((k:any)=> {
    //   regions_array.push(k.Region)
    // })
    let regions_array:any = result.map((k:any)=>k.Region);


    // let unique_regions = regions_array.filter(this.onlyUnique);
    let unique_regions = [...new Set(regions_array)];
    console.log(unique_regions);
    this.regionList = unique_regions;
  }

  async updateAllCategoryNames(){
    let categories_array:any = [];
    const result = await this.categoriesService.getCategoryNames(this.offset, this.limit, '');
    // console.log(result)

    result.map((k:any)=> {

      categories_array.push(k.Name_of_Sub_Category)
      // console.log(k)

    })
      let unique_categories = categories_array.filter(this.onlyUnique);
      // console.log(unique_categories);
      this.categoryList = unique_categories;
  }
  // helpers

  getLowestKey(obj:any) {
    let key = Object.keys(obj).reduce((key, v) => obj[v] < obj[key] ? v : key);
    return key
  }

  // var lowest = lowestValueAndKey(arr);
  // console.log(lowest);


  onlyUnique(value:any, index:any, self:any) {
    return self.indexOf(value) === index;
  }



// button submit functions
  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.warn(this.profileForm.value);
    console.warn(this.profileForm.value.categoryName);
    this.name = this.profileForm.value.categoryName;
    this.period = this.profileForm.value.period;
    this.guidance = this.profileForm.value.guidance;
    this.grade_id = this.profileForm.value.gradeID;
    this.region = this.profileForm.value.region;
    this.grade = this.profileForm.value.grade;

    if(this.profileForm.value){
      console.log(this.profileForm.value)
      this.updateCategories();
      // this.profileForm.value.guidance = '';
      // this.profileForm.value.gradeID = '';
    }
    // this.region = this.profileForm.value.categoryName;

  }

  onSubmitTestUtterance(){
    this.result = null;
    this.userInput = this.nluForm.value.user_input;
    this.kbId = this.nluForm.getRawValue().kbid;
    this.appId = this.nluForm.getRawValue().appid;
    this.nlpData = null;


    this.nluForm.patchValue({
      kbid: this.kbId,
      appid:this.appId
  });

    console.log(this.userInput)
    let payload =JSON.stringify({
        "appId": this.appId,
        "kbId": this.kbId,
        "q": this.userInput
      });

      console.log("7")
      console.log("user asked:  ", this.nluForm.value)
      console.log("pass this to nlu api, get response")
      this.isLoading = true;
      this.categoriesService.testUtterance(payload).subscribe(data => {
        // console.log(data)

      if(data){
        this.nlpData = data;
        this.isLoading = false;
        alert("im here")
        this.updateCategoriesWithNLUData()
      }

      },
      err=> {
        // this.isLoading = false;
        console.log("9")
        console.log(err)
      })
  }

  searchAgain(){
    // this.profileForm.reset();
    // this.nluForm.reset();
    // this.result = null;
  }

  showPrevious() {
    return this.offset > 0;
  }

  showNext() {
    return this.offset + 10 < this.count;
  }

  async onPrevious() {
    this.offset -= 10;
    await this.updateCategories();
  }

  async onNext() {
    this.offset += 10;
    await this.updateCategories();
  }

}
