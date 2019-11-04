import {AfterViewInit, Component, Inject, APP_ID} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { callbackify } from 'util';
import { LocationStrategy } from '@angular/common';

/*
  TODO - 
    1. Add image outfit to UI. 
    2. Show icon of weather in UI. 
    3. Show outfit for weather. 
    4. Search function for city.
    5. Dynamic background based on time of day. 
*/

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'Clima Closet';

  public API_KEY: string = "8300f2d4182612b5d44c3fcb22ca0acc"

  //Variables holding fields for UI components.
  public city: string;  
  public temperature: number; 
  public condition: string;

  //UI HTML components. 
  public cityTag: HTMLElement;
  public temperatureTag: HTMLElement; 
  public conditionTag: HTMLElement; 



  constructor(private httpClient: HttpClient) {}

  ngAfterViewInit() {
    //Initialize HTML elements for DOM objects to access.
    this.cityTag = document.getElementById("location-city");
    this.temperatureTag = document.getElementById("temperature-degree");
    this.conditionTag = document.getElementById("temperature-condition");

    this.locate();
  }

  public locate() {    
    if(navigator.geolocation) {     //If we can retrieve the location
      let lat = navigator.geolocation.getCurrentPosition(position => {

        console.log(position);
        let lat: number = position.coords.latitude;
        let long: number = position.coords.longitude;
        //this.updateCity(lat, long);
        this.getWeatherData(lat, long)

      })
    }
    else {
      this.cityTag.innerHTML = "Cannot retrieve location."
    }
  }

  public getWeatherData(lat: number, long: number) {
    const proxy = "https://cors-anywhere.herokuapp.com/";   //proxy needed to go around http request error. 
    const API_URL = proxy+"https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+long+"&appid="+this.API_KEY;
    //Get request & we are retrieving the data as a JSON. 
    fetch(API_URL)
        .then(response => {
          return response.json();
        })
        .then(data => {
          console.log(data);
          this.temperature = this.roundDigits(data.main.temp - 273.15); 
          this.condition = data.weather[0].main;
          this.city = data.name;
          console.log("Temp = " + this.temperature + " condition = " + this.condition);
          this.updateUI()
        });
  }

  public updateUI() {
    this.cityTag.innerHTML = this.city;
    this.temperatureTag.innerHTML = this.temperature+"";
    this.conditionTag.innerHTML = this.condition;
  }

  public roundDigits(temp: number) : number {
    return Math.round(temp * 100) / 100;
  }

 
}




 //Reverse geocode to get city of the current location
  // public updateCity(lat: number, long: number) {
  //   const reverse = require('reverse-geocode')
  //   let geoDataString : string = JSON.stringify(reverse.lookup(lat, long, 'us')); 
  //   let geoData = JSON.parse(geoDataString);
  //   this.city = geoData.city; 
  // }