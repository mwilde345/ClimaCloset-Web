import {AfterViewInit, Component, Inject, APP_ID} from '@angular/core';
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
  public API_KEY: string = "8300f2d4182612b5d44c3fcb22ca0acc"

  constructor(private httpClient: HttpClient) {}

  ngAfterViewInit() {
    this.locate();
    this.cityTag = document.getElementById("location-city")
  }

  public locate() {    
    if(navigator.geolocation) {
      let lat = navigator.geolocation.getCurrentPosition(position => {
        console.log(position);
        let lat: number = position.coords.latitude;
        let long: number = position.coords.longitude;
        this.updateCity(lat, long);
        this.getWeatherData(lat, long)
      })
    }
    else {
      this.cityTag.innerHTML = "Cannot retrieve location."
    }
  }

  //api.openweathermap.org/data/2.5/weather?lat=35&lon=139
  public getWeatherData(lat: number, long: number) {
    const proxy = "https://cors-anywhere.herokuapp.com/";
    const API_URL = proxy+"https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+long+"&appid="+this.API_KEY;
    fetch(API_URL)
        .then(response => {
          return response.json();
        })
        .then(data => {
          console.log(data);
        });
  }

  public updateCity(lat: number, long: number) {
    const reverse = require('reverse-geocode')
    let geoDataString : string = JSON.stringify(reverse.lookup(lat, long, 'us')); 
    let geoData = JSON.parse(geoDataString);
    let city = geoData.city; 
    this.updateUI(city)

  }

  public updateUI(city: string) {
    this.cityTag.innerHTML = city;
  }





 

}
