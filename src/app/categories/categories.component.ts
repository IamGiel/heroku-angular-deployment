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
  periodList:any = [];
  grade = "";
  userInput = '';
  // name: "Carbon Steel", period: "Feb-22", guidance: "Delivered Eastern China Domestic"
  guidance_dropdown = [];
  gradeid_dropdown = [];
  hasChange: boolean = false;
  categories: Category[] = [];
  result:any = null;
  // Luis migration keys
  // appId = '4597897d-addf-46cd-9849-87a123cf7e26';
  // kbId = 'PgrzMKQsHIq0PkkBzCxqN';
  // abi 176 keys
  appId = '02672bab-9538-4b8a-a669-5ed8bdaa6de5';
  kbId = 'GivneeAOcObmDkRDQd4E2';

  nlpData: any;
  lvscore:number = Infinity;

  payload:any = {};
  score:any;

  // reactive response
  checkif_priceIntent:any = false;
  hasDateRangeEntity:any = false;
  cat_name:any = '';
  reg_name:any = '';
  period_name:any = '';
  range_of_dates:any = null;



  profileForm = this.fb.group({
    categoryName: ['', Validators.required],
    period: [''],
    guidance: [''],
    gradeID: [''],
    region:['', Validators.required],
    grade: ['']
    // region: ['',Validators.required]
    // ,
    // aliases: this.fb.array([
    //   this.fb.control('')
    // ])
  });
  // kbId = "PgrzMKQsHIq0PkkBzCxqN"; //PgrzMKQsHIq0PkkBzCxqN
  // appId = "4597897d-addf-46cd-9849-87a123cf7e26";
  // nluForm = this.fb.group({
  //   user_input: ['', Validators.required],
  //   kbid: [{value: 'PgrzMKQsHIq0PkkBzCxqN', disabled: true}, Validators.required],
  //   appid: [{value:'4597897d-addf-46cd-9849-87a123cf7e26', disabled:true}, Validators.required]
  // });
  nluForm = this.fb.group({
    user_input: ['', Validators.required],
    kbid: [{value: 'GivneeAOcObmDkRDQd4E2', disabled: true}, Validators.required],
    appid: [{value:'02672bab-9538-4b8a-a669-5ed8bdaa6de5', disabled:true}, Validators.required]
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
    this.updateAllCategoryNames()
    this.updateAllPeriod()

  }

  lavenshtein(wordA:string, wordB:string){
    let distance = levenshtein.get(wordA, wordB);
    // console.log(distance)
    return distance;
  }

  async updateCategories() {
    // this.isLoading = true;
    // console.log("2")
    const result = await this.categoriesService.getCategories(this.offset,this.limit,this.name,this.period,this.guidance, this.grade_id, this.region, this.grade);

    if(result){
      // this.isLoading = false;
      // console.log("3")
      this.result = result.data.categories.category;
    }
    if(this.result.length <= 0){
      this.searchAgain()
    }
    // this.getGuidanceDropdown(result)
    // this.getGradeeDropdown(result)
    // console.log("result >>>> ", result)
  }

  async updateCategoriesWithNLUData() {
    this.checkif_priceIntent = false;
    this.hasDateRangeEntity = false;
    this.cat_name = "";
    this.reg_name = "";
    this.period_name = "";
    this.entities = null;
    this.result = null;
    this.range_of_dates = null;
    let result_;
    // this.nlpData = null;
    let entities = this.nlpData?.result?.entities;
    const region_fields:any = [
      ''
    ]
    const calculate = (array?:[], val?:any, controller?:string) => {
      // console.log(val, controller)
      let minL = Infinity;
      let result:any;
      let date_reconstruct:any;
      let currentL;
      let o:any = {};
      // console.log("this array ", array)
      if(array&&controller!=='daterange'){
        array.forEach((element:any) => {
          let db_string = element.toLowerCase().replace(/[^a-zA-Z]/g, "");
          let user_string = val.value.toLowerCase().replace(/[^a-zA-Z]/g, "");
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
        let key:any = Object.keys(o).reduce((key, v) => o[v] < o[key] ? v : key);
        // console.log(key)
        result = {
          "key":key,
          // "range":{
          //   "start":key.parsedValue[0].resolution[0].start,
          //   "end":key.parsedValue[0].resolution[0].end,
          // },
          "score":minL
        }

      } else if(controller=='daterange') {
        // console.log("controller = daterange")
        let luisdate_start = this.normedLuis_Date(val?.parsedValue[0]?.resolution[0]?.start, "timex");
        let luisdate_end = this.normedLuis_Date(val?.parsedValue[0]?.resolution[0]?.end, "timex");
        this.getAllRangofDates(luisdate_start, luisdate_end)
        if(this.periodList.indexOf(`${luisdate_start}`) === 0){
          const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "July",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
          // console.log(monthNames[new Date(`${luisdate_start}`).getMonth()], new Date(`${luisdate_start}`).getFullYear());
          let month = monthNames[new Date(`${luisdate_start}`).getMonth()];
          let year = `${new Date(`${luisdate_start}`).getFullYear()}`.substring(2,4)
          date_reconstruct = `${month}-${year}`;
          // console.log(date_reconstruct)
        }
        result = {
          "key":date_reconstruct,
          "score":minL,
          "daterange": val?.parsedValue[0]?.resolution[0]
        }
      }

      // console.log("calculate returned result >>>>> ", result)
      return result;
    }
    let entityObj:any = {
      "datetimeV2":{array:this.periodList, assign:(val:any)=>{this.period_name = val},score:null, detailedType:(detail_type:any)=>detail_type},
      "RegionEntity":{array:this.regionList, assign:(val:any)=>{this.reg_name = val},score:null},
      "geographyV2":{array:this.regionList, assign:(val:any)=>{this.reg_name = val},score:null},
      "CategoryListEntity":{array:this.categoryList, assign:(val:any)=>{this.cat_name = val},score:null}
    };

    if(entities && entities.length){
      entities.forEach((k:any)=> {
        // capture key words
        if(k.entity in entityObj){
          const res:any = calculate(entityObj[k.entity].array, k, k.detailedType)
          // console.log(res)
          if(res){
            entityObj[k.entity].assign(res.key)
            entityObj[k.entity].score = res.score;
            if(res.daterange){
              this.range_of_dates = res.daterange
              console.log("this range of dates: ",this.range_of_dates)
            }
          }

        }
        // capture intent
        if(k.entity == "PriceKeyWordEntity"){
          alert("price")
          this.checkif_priceIntent = true;
        }
        if(k.entity == "DateRangeKeywordEntity"){
          alert("price")
          this.hasDateRangeEntity = true;
        }
      })


      if(this.hasDateRangeEntity){
        console.log("have range of dates block")
         result_ = await this.categoriesService.getDateRange(this.offset,this.limit,this.cat_name, this.reg_name, this.period_name);
      } else {
         result_ = await this.categoriesService.getCategories(this.offset,this.limit,this.cat_name,this.period_name,this.guidance, this.grade_id, this.reg_name, this.grade);
      }
      if(result_){
        console.log("result blok")
        this.result = result_.data.categories.category;
        this.payload.category = {"name":this.cat_name, "score":entityObj["CategoryListEntity"].score};
        this.payload.region ={"name":this.reg_name, "score":entityObj["RegionEntity"].score}
        this.payload.priceIntent = this.checkif_priceIntent;
        this.payload.period = {"name":this.period_name, "score":entityObj["datetimeV2"].score};
        this.payload.daterange = {"name":this.range_of_dates, "score":entityObj["datetimeV2"].score};
        console.log(this.payload)
      } else {
        alert('err')
        // console.log("5")
      }
    }
  }

  async updateAllRegions(){
    // let regions_array:any = [];
    const result = await this.categoriesService.getRegions(this.offset, this.limit, '');
    let regions_array:any = result.map((k:any)=>k.Region);
    // let unique_regions = regions_array.filter(this.onlyUnique);
    let unique_regions = [...new Set(regions_array)];
    // console.log(unique_regions);
    this.regionList = unique_regions;
  }

  async updateAllPeriod(){
    this.isLoading = true;
    const result = await this.categoriesService.getPeriods(this.offset, this.limit, '');
    if(result){
      this.isLoading = false;
      // console.log(result)
      let temp_array:any = result.map((k:any)=>{
        // console.log(this.normedDBDate(k.Actual_Period))
        return this.normedDBDate(k.Actual_Period); // date in getTime() value
      });
      let unique_periods = [...new Set(temp_array)];
      // console.log(unique_periods);
      this.periodList = unique_periods;
    }

  }

  async getAllRangofDates(start:any,end:any){
    // console.log("im here! ", JSON.stringify(start), JSON.stringify(end))
    let daterange_payload:any = {
      start,end
    };
    const result = await this.categoriesService.getDateRange(this.offset, this.limit, this.cat_name,this.reg_name,  JSON.stringify(daterange_payload));
    // console.log(result)
    this.result = result;
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

  normedLuis_Date(date_string:string, whichTime:any) {
    // console.log(`${date_string}`); // 2020-01-01
    let os = `${date_string}`; // format for luis date new Date("YYYY", "MM", -29)
    let date_result;
    if (whichTime == "parsedValue") {
        alert("parsedValue");
        let month = os.substring(4, 7);
        let year = os.substring(11, 15);
        let ds = `${year}-${month}-21`;
        // console.log("ds for luis date ", ds);
        date_result = new Date(ds);
    } else if (whichTime == "timex") {
        alert("timex"); // format for luis date new Date("YYYY", "11", -29)
        let month = os.substring(5, 7);
        let year = os.substring(0, 4);
        // console.log(month, year);
        date_result = new Date(parseInt(year), parseInt(month), -29);

        // console.log(date_result);
    }

    return date_result;
    return date_result.getTime();
}
  normedDBDate(db_date:string) {
    // console.log("dbdate", db_date); // format for db date --> new Date("Month YYYY")
    let year = parseInt(db_date.substring(4, 6));
    let month = db_date.substring(0, 3); // 3 char month abbreviations July = Jul
    // console.log(month, year, "format we want: ", `new Date("Month YYYY")`);
    let res;
    // case 21 for 20 20s
    // case 19 for 20 10s
    // case 07 for 20 00s
    // case 00 for 20 00s
    // case 99 for 19 00s
    // case 89 for 19 00s
    // return `20${year}`;

    if (year <= 99 && year >= 50) {
        // prepend 19 to year
        res = `19${year}`;
    }
    if (year <= 50) {
        // prepend 19 to year
        res = `20${year}`;
    }
    // console.log("dbdate before output = ", `${month} and ${res}`);
    let output = new Date(`${month}, ${res}`);
    // console.log(output.getTime);

    return `${output}`;
}
  getLowestKey(obj:any) {
    let key = Object.keys(obj).reduce((key, v) => obj[v] < obj[key] ? v : key);
    return key
  }
  onlyUnique(value:any, index:any, self:any) {
    return self.indexOf(value) === index;
  }



// button submit functions
  onSubmit() {
    // TODO: Use EventEmitter with form value
    // console.warn(this.profileForm.value);
    // console.warn(this.profileForm.value.categoryName);
    this.name = this.profileForm.value.categoryName;
    this.period = this.profileForm.value.period;
    this.guidance = this.profileForm.value.guidance;
    this.grade_id = this.profileForm.value.gradeID;
    this.region = this.profileForm.value.region;
    this.grade = this.profileForm.value.grade;

    if(this.profileForm.value){
      // console.log(this.profileForm.value)
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

    let payload =JSON.stringify({
        "appId":  this.appId,
        "kbId": this.kbId,
        "q": this.userInput,
        "suggestedConfidenceRange": [90,100],
        "unrecognizedConfidenceRange": [0,89],
        "allowSuggested": true,
        "allowUnrecognized": true,
        "spellCheckEnabled": true
      });
      this.isLoading = true;
      this.categoriesService.testUtterance(payload).subscribe(data=>{
        if(data){
          this.nlpData = data;
          this.isLoading = false;
          alert("im here")
          this.updateCategoriesWithNLUData()
        }
      }, err=> {
        // console.log(err)
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
