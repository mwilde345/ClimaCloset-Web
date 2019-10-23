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
  public cityTag = document.getElementById("location-city")

  constructor(private httpClient: HttpClient) {}

  ngAfterViewInit() {
    this.locate();
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
    console.log(reverse.lookup(lat, long, 'us'))    
  }




 

}
