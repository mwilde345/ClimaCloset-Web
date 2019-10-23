import {AfterViewInit, Component, Inject} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { callbackify } from 'util';
import { LocationStrategy } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'Clima Closet';

  public weatherCondition: string;
  public cityTag: HTMLElement;

  constructor(private httpClient: HttpClient) {}

  ngAfterViewInit() {
    this.locate();
    this.cityTag = document.getElementById("location-city")
  }

  public locate() {    
    if(navigator.geolocation) {
      let lat = navigator.geolocation.getCurrentPosition(position => {
        console.log(position);
        this.updateCity(position.coords.latitude, position.coords.longitude);
      })
    }
    else {
      this.cityTag.innerHTML = "Cannot retrieve location."
    }
  }

  public updateCity(lat: number, long: number) {
    const reverse = require('reverse-geocode')
    let geoDataString : string = JSON.stringify(reverse.lookup(lat, long, 'us')); 
    let geoData = JSON.parse(geoDataString);
    let city = geoData.city; 
    this.cityTag.innerHTML = city;
  }




 

}
