import {AfterViewInit, Component, Inject, APP_ID} from '@angular/core';
import { callbackify } from 'util';
import { LocationStrategy } from '@angular/common';

/*
  TODO - 
    Dynamic background based on time of day. 
    Add icon for webpage.
    Remove placeholder text on page loading. 
*/

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'Clima Closet';

  //URLs + key needed for API calls. 
  public API_KEY: string = "8300f2d4182612b5d44c3fcb22ca0acc";
  public API_URL_GPS: string = "https://api.openweathermap.org/data/2.5/weather?lat=";
  public API_URL_CITY: string = "https://api.openweathermap.org/data/2.5/weather?q=";
  public ICON_URL: string = "http://openweathermap.org/img/wn/";
  public proxy: string = "https://cors-anywhere.herokuapp.com/";   //proxy needed to go around http request error. 

  //Image path to retrieve graphics. 
  public imagePath: string = "../assets/graphics/outfits/"

  //Variables holding fields for UI components.
  public city: string;  
  public rawTemperature: number; 
  public temperature: number; 
  public condition: string;
  public iconID: string;

  //UI HTML components. 
  public cityTag: HTMLElement;
  public temperatureTag: HTMLElement; 
  public temperatureUnit: HTMLElement;
  public conditionTag: HTMLElement; 
  public iconImage: HTMLImageElement; 
  public outfitImage: HTMLImageElement;
  public searchBar: HTMLInputElement;

  //Flag to switch between temperature units. 
  public celsiusTemp: boolean = false;

  //File names for the outfit images in assets folder. 
  public averageOutfits: Array<string> = ["Average 1", "Average 2", "Average 3", "Average 4"];
  public chillOutfits: Array<string> = ["Chill 1", "Chill 2", "Chill 3", "Chill 4", "Chill 5"]
  public coldOutfits: Array<string> = ["Cold 1", "Cold 2", "Cold 3"]
  public warmOutfits: Array<string> = ["Warm 1", "Warm 2", "Warm 3", "Warm 4"]

  constructor() {}

  ngAfterViewInit() {
    //Initialize HTML elements for DOM objects to access.
    this.cityTag = document.getElementById("location-city");
    this.temperatureTag = document.getElementById("temperature-degree");
    this.temperatureUnit = document.getElementById("temperature-unit");
    this.conditionTag = document.getElementById("temperature-condition");
    this.iconImage = document.getElementById("location-icon") as HTMLImageElement;
    this.outfitImage = document.getElementById("outfit") as HTMLImageElement;
    this.searchBar = document.getElementById("search_bar") as HTMLInputElement;

    //Focus is when you are inside the search_bar => extend bar. 
    this.searchBar.addEventListener('focus', () => {
      this.searchBar.parentElement.style.width = '220px';
      this.searchBar.parentElement.style.marginRight = '0px';
    });

    //Blur is when you are not clicked inside the search_bar => reduce bar. 
    this.searchBar.addEventListener('blur', () => {
      if(this.searchBar.value.length === 0) {
        this.searchBar.parentElement.style.width = '35px';
        this.searchBar.parentElement.style.marginRight = '0px';
      }
    });

    this.locate();    //Start with user location => locate & call API with user coordinates. 

  }


  //Locate user on startup. 
  public locate() {    
    if(navigator.geolocation) {     //If we can retrieve the location

      let lat = navigator.geolocation.getCurrentPosition(position => {
        let lat: number = position.coords.latitude;
        let long: number = position.coords.longitude;
        this.buildURL(lat, long, "");     //Once we have coordinates => build URL for API call. 
      });

    }
    else {
      this.cityTag.innerHTML = "Cannot retrieve location."
    }
  }


   //Find city for API call. 
   public searchCity(event: KeyboardEvent) {
    this.city = this.searchBar.value;
    this.buildURL(0, 0, this.city);
  }


  //Helper function to build the endpoint URL for either coordinate or city API call. 
  public buildURL(lat: number, long: number, city: string) {
    var API_URL = "";
    if(city === "") {
      API_URL = this.proxy+this.API_URL_GPS+lat+"&lon="+long+"&appid="+this.API_KEY;
    }
    else {
      API_URL = this.proxy+this.API_URL_CITY+city+"&appid="+this.API_KEY;
    }
    
    this.fetchAPI(API_URL);
  }


  //Fetch all the needed information to populate UI. 
  public fetchAPI(url: string) {
    //Get request & we are retrieving the data as a JSON. 
    fetch(url)
        .then(response => {
          return response.json();
        })
        .then(data => {
          console.log(data);
          this.rawTemperature = this.roundDigits(data.main.temp);
          this.condition = data.weather[0].main;
          this.city = data.name;
          this.iconID = data.weather[0].icon;
          this.updateUI()         //Once all the data has been retrieved, we can update the UI. 
        });
  }


  public updateUI() {
    this.cityTag.innerHTML = this.city;       //City tag.
    this.conditionTag.innerHTML = this.condition;     //Condition tag. 
    this.iconImage.src = this.ICON_URL + this.iconID + "@2x.png";     //Icon tag. 
    
    //Temperature tag. 
    var formattedTemperature = this.rawTemperature; 
    if(this.celsiusTemp) {
      formattedTemperature -= 273.15;
      this.temperatureUnit.innerHTML = "C";
    }
    else {
      formattedTemperature = 9/5 * (formattedTemperature - 273.15) + 32;
      this.temperatureUnit.innerHTML = "F";
    }
    this.temperatureTag.innerHTML = this.roundDigits(formattedTemperature) + "";    

    //Outfit tag. 
    var outfit: string = this.chooseOutfit();
    if(outfit === "cold") {
      const outfitID : number = Math.floor(Math.random() * 3)
      const outfitName: string = this.coldOutfits[outfitID];
      this.outfitImage.src = this.imagePath + outfitName + ".png";
    }
    if(outfit == "chill") {
      const outfitID : number = Math.floor(Math.random() * 5)
      const outfitName: string = this.chillOutfits[outfitID];
      this.outfitImage.src = this.imagePath + outfitName + ".png";
    }
    if(outfit == "average") {
      const outfitID : number = Math.floor(Math.random() * 4)
      const outfitName: string = this.averageOutfits[outfitID];
      this.outfitImage.src = this.imagePath + outfitName + ".png";
    }
    if(outfit == "warm") {
      const outfitID : number = Math.floor(Math.random() * 4)
      const outfitName: string = this.warmOutfits[outfitID];
      this.outfitImage.src = this.imagePath + outfitName + ".png";
    }
  }


  //Decide what type of outfit should be chosen. 
  public chooseOutfit() : string {
    const temp: number = this.rawTemperature - 273.15;
    if(temp < -5) return "cold";
    if(temp >= -5 && temp < 9) return "chill";
    if(temp >= 9 && temp < 16) return "average";
    if(temp >= 17) return "warm";
  }


  //Celsius <=> Farenheit. 
  public switchTempUnit() {
    this.celsiusTemp = !this.celsiusTemp;
    this.updateUI();
  }

  //Helper function to round to 2 digits. 
  public roundDigits(temp: number) : number {
    return Math.round(temp * 100) / 100;
  }

 
}
