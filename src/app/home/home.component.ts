import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../services/categories.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private categoryService: CategoriesService, private http: HttpClient) { }

  ngOnInit(): void {

  }


}
