import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Apollo, gql, QueryRef} from 'apollo-angular';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';


// create the interfaces
export interface Category {
  Category_ID:string;
  Name_of_Category:string;
  Sub_Category_ID:string;
  Name_of_Sub_Category:string;
  Grade_ID:string;
  Grade:string;
  Grade_Type_ID:string;
  Grade_Type:string;
  Country:string;
  Region:string;
  Supplier_Type_ID:string;
  Supplier_Type:string;
  Currency:string;
  Unit:string;
  Period:string;
  Actual_Period:string;
  Price_Point_:string;
  Percent_Change:string;
  Hovering_indicator:string;
  Market_Outlook:string;
  Feedstock_ID:string;
  Feedstock:string;
  Substitute_ID:string;
  Substitute:string;
  Sources:string;
  Accuracy_3_months:string;
  Accuracy_6_months:string;
  Accuracy_12_months:string;
  Market_Overview:string;
  Related_Sub_Category_ID:string;
  Related_Sub_Category:string;
  Guidance:string;
  Source_Statement:string;
}

export interface CategoryResult {
  count: number;
  category: Category[];
}

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  headers = 'AAABogECAQB4lO5qrMbBPYllyByB6U98HpyJ7eWikC9ICFdAdnZ+Co8BEfAIXqvl78az3io5atIoPgAAAWgwggFkBgkqhkiG9w0BBwagggFVMIIBUQIBADCCAUoGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMWAXfsfjIWH2DTBQgAgEQgIIBGylez8PbYhQd007eiuOgATchng1MHqEYqhLZMv4v6rxFI49LJJITtW/uYfumlq+OPlSXoAsMA70RbzrwFvhQO6faC8yWul9YYFQU04ZA/Ttqgs78WF2wzEWVBhmCDpnjW99+J4eoQLfzzRcWH5dmsgZKGoVORaVidKs90KkBAHeYdLovwOkAuCnXoRB44hcFQTE1geJil+/R65Trc7LuSI5I1MK7F/tQ6odYr2C2dYvkz2Xt9VcTUhK4FQ5cmxVwmZwPs+laHTGA0kdIdVO6F301Z77AoQMmSxsJRswbYLr4sq/M5X4Vh2odckwceoILXxpLpZ98ZFAp73sNR4cRfZhot0qBRjSb+0sfuIOjH29aIFRJeHNqAQZvpnIAAAFFZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmhZMk52ZFc1MFNXUWlPaUl4T1dGaE5EVmtaUzB4T0RNMExUUXhPV1l0T1RWa1pTMDVOVFV6Tm1ZellqazVOREFpTENKMWMyVnlTV1FpT2lJMk5UTmlNRFEzWmkwMU5tRTNMVFEwTVRjdFlUUXhOQzFrWkRKa1lqUXlOR1prWkRJaUxDSnliMnhsSWpvaVFVUk5TVTRpTENKaGRYUm9WRzlyWlc0aU9pSm1OalJpTjJOaE9DMWpOak5oTFRSa1pUa3RPRGRrTXkweE9XTTJNVEUzT0RNeE1EWWlMQ0pwWVhRaU9qRTJNemcwTURjMk9ERjkuX05TVmNTTmo4UGN5ajRIUlVGc2IxY3JCN01HRkFKTUVDcnpDNzlCY3ZyOA==';
  private findCategoriesQuery:QueryRef<
    {categories:any}
  >;
  private findDateRange:QueryRef<
    {categoriesv2:any}
  >;
  private findAllRegions:QueryRef<
    {categories:any}
  >;
  private findAllPeriod:QueryRef<
  {categories:any}
>;
  private findAllCategoryNames:QueryRef<
    {categories:any}
  >;
  constructor(private apollo: Apollo, private http: HttpClient) {
    this.findCategoriesQuery = this.apollo.watchQuery({
      query:gql`
        query categories($offset: Int, $limit: Int, $name: String, $period: String, $guidance: String, $Grade_ID:String, $region:String, $grade:String) {
          categories(offset: $offset, limit:$limit,name: $name,period: $period,guidance: $guidance, Grade_ID:$Grade_ID,region:$region, grade:$grade) {
            count
            category {
              Name_of_Sub_Category
              Guidance
              Market_Overview
              Region
              Actual_Period
              Price_Point
              Currency
              Unit
              Grade_ID
              Grade
            }
          }
        }
      `
    })
    this.findAllRegions = this.apollo.watchQuery({
      query:gql`
        query regionsInCategories($offset: Int, $limit: Int, $region: String){
          categories(offset: $offset, limit:$limit,region:$region) {
            count
            category {
              Region
            }
          }
        }
      `
    })

    this.findAllCategoryNames = this.apollo.watchQuery({
      query:gql`
        query categoryNames($offset: Int, $limit: Int, $name: String){
          categories(offset: $offset, limit:$limit,name:$name) {
            count
            category {
              Name_of_Sub_Category
            }
          }
        }
      `
    })

    this.findAllPeriod = this.apollo.watchQuery({
      query:gql`
        query PeriodInCategories($offset: Int, $limit: Int, $period: String){
          categories(offset: $offset, limit:$limit,period:$period) {
            count
            category {
              Actual_Period
            }
          }
        }
      `
    })

    this.findDateRange = this.apollo.watchQuery({
      query:gql`
        query DateRange($offset: Int, $limit: Int,$name:String,$region:String, $daterange: String){
          categoriesv2(offset: $offset, limit: $limit, name:$name,region: $region, daterange:$daterange) {
            count
            category {
              Name_of_Sub_Category
              Guidance
              Market_Overview
              Region
              Actual_Period
              Price_Point
              Currency
              Unit
              Grade_ID
              Grade
            }
          }
        }
      `
    })
  }
  async getCategories(offset?: number, limit?: number, name?: string, period?: string, guidance?: string, Grade_ID?:string, region?:string, grade?:string) {
    const result = await this.findCategoriesQuery.refetch({ offset, limit, name, period, guidance, Grade_ID, region, grade });
    // console.log(result)
    return result;
  }

  async getRegions(offset?: number, limit?: number, region?:string) {
    const result = await this.findAllRegions.refetch({ offset, limit, region });
      // console.log(result.data.categories.category)
      return result.data.categories.category;
  }
  async getPeriods(offset?: number, limit?: number, period?:string) {
    const result = await this.findAllPeriod.refetch({ offset, limit, period });
      return result.data.categories.category;
  }
  async getDateRange(offset?: number, limit?: number, name?: string, region?:string, daterange?:string ) {
    const result = await this.findDateRange.refetch({ offset, limit, name, region, daterange });
    console.log("sevice component result ", result.data.categoriesv2.category)
      return result.data.categoriesv2.category;
  }
  async getCategoryNames(offset?: number, limit?: number, name?:string) {
    const result = await this.findAllCategoryNames.refetch({ offset, limit, name });
      // console.log(result.data.categories.category)
      return result.data.categories.category;
  }
  testUtterance(data: string): Observable<any> {
    const headers = { 'Authorization': this.headers }
    return this.http.post<any>('https://nlu.staging.api.onereach.ai/meaning', data, {headers})
  }

  addUtterance(data:any): Observable<any> {
    console.log(data)
    let config = {
      method: 'post',
      url: 'https://nlu.staging.api.onereach.ai/knowledge-base/pair',
    };

    const headers = { 'Authorization': this.headers }
    return this.http.post<any>(config.url, data, {headers})
  }

  getUtterances(): Observable<any> {
    let config = {
      method: 'get',
      url: 'https://nlu.staging.api.onereach.ai/applications?kbId=PgrzMKQsHIq0PkkBzCxqN&limit=15&text=&projection=[%22utterances%22]',
    };

    const headers = { 'Authorization': this.headers }
    return this.http.get<any>(config.url, {headers})
  }

}
