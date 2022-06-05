const searchField=document.querySelector('.search-text')
const searchBtn=document.querySelector('.search')
const content=document.querySelector('.content')
const loadingScreen=document.querySelector('.loading-screen')

searchBtn.addEventListener("click", search)
function search(){
    content.classList.add('hidden')
    loadingScreen.style.display=""
    let searchTerm=searchField.value
    let searchLogo=document.querySelector('.search')
    document.querySelector('.error-screen').style.display="none"
    searchLogo.classList.add('earth')
    searchLogo.textContent="public"
    genUrl(searchTerm)
}

//<-----------------main functions here------------------->

let defaultLink="https://api.openweathermap.org/data/2.5/weather?q="
let link
let units='metric'
let tempUnit

//data to extract
let temperature
let feelTemp
let lowTemp
let highTemp
let currentWeather
let weatherDescription
let city
let country
let pressure
let humidity
let localTime


function genUrl(city){//creates link for fetching weather of the given location 
    link=defaultLink+city+"&appid=5d84b82f56eea502c9c291b6844b1530"+"&units="+units
    getWeather()
}
async function getTime(){
    let time=await fetch("https://api.ipgeolocation.io/timezone?apiKey=f659a580ee0c42e0a87f44f029a74ee1&location="+city)
    time.json().then(function(time){
        localTime=time.time_24
        const timenow=new Date(localTime)
        document.querySelector('.time').textContent=localTime
        setTimeout(() => {
            getTime()
        }, 500);
    }).catch(err=>{
        console.log(err)
    })
}
async function getWeather(){
     let weather=await fetch(link, {mode: 'cors'})
     weather.json().then(function(weather){
         currentWeather=weather.weather[0].main
         weatherDescription=weather.weather[0].description
         temperature=weather.main.temp
         temperature=Math.ceil(temperature)
         feelTemp=weather.main.feels_like
         feelTemp=Math.ceil(feelTemp)
         lowTemp=weather.main.temp_min
         lowTemp=Math.floor(lowTemp)
         highTemp=weather.main.temp_max
         highTemp=Math.ceil(highTemp)
         country=weather.sys.country
         city=weather.name
         getTime()
         humidity=weather.main.humidity
         pressure=weather.main.pressure
         
         if(units=='metric'){
             tempUnit="ºC"
         }
         showContent()
         displayData()
     }).catch(e=>{
        console.log(e)
        loadingScreen.style.display="none"
        document.querySelector('.error-screen').style.display=""
        let searchLogo=document.querySelector('.search')
        searchLogo.classList.remove('earth')
        searchLogo.textContent="search"
    })
}
function showContent(){
    content.classList.remove('hidden')
    loadingScreen.style.display="none"
    document.querySelector('.error-screen').style.display="none"
    let searchLogo=document.querySelector('.search')
    searchLogo.classList.remove('earth')
    searchLogo.textContent="search"
}

function displayData(){//displays data received from server
    let tempElement=document.querySelector('.current-temperature')
    let minTempElement=document.querySelector('.min-temp')
    let maxTempElement=document.querySelector('.max-temp')
    //tempereatures
    tempElement.textContent=temperature+tempUnit
    checkTemp(tempElement,temperature)
    minTempElement.textContent=lowTemp+tempUnit
    checkTemp(minTempElement,lowTemp)
    maxTempElement.textContent=highTemp+tempUnit
    checkTemp(maxTempElement,highTemp)
    document.querySelector('.feels-like-temp').textContent=feelTemp+tempUnit
    checkTemp(document.querySelector('.feels-like-temp'),feelTemp)
    //weather
    document.querySelector('.weather-text').textContent=currentWeather
    checkWeather()
    document.querySelector('.weather-description').textContent=weatherDescription
    //extras
    document.querySelector('.humidity').textContent=humidity+'%'
    checkHumidity(document.querySelector('.humidity'))
    document.querySelector('.pressure').textContent=pressure+" hPa"
    //update city and country
    document.querySelector('.city').textContent=city
    document.querySelector('.country').textContent=country
}

function checkWeather(){
    let weatherLogo=document.querySelector('.weather-logo')
    if(currentWeather=="Haze"){
        weatherLogo.textContent="sunny"
        weatherLogo.style.color="yellow"
    }
    else if(currentWeather=="Rain"){
        weatherLogo.textContent="thunderstorm"
        weatherLogo.style.color="#B5EAD7"
    }
    else if(currentWeather=="Clouds"){
        weatherLogo.textContent="cloudy"
        weatherLogo.style.color="#9FC4E1f"
    }
}
function checkHumidity(element){
    if(humidity<40){
        element.style.color="tomato"
    }
    else if(humidity>=40 && humidity<70){
        element.style.color="yellow"
    }
    else if(humidity>=70){
        element.style.color="#B5EAD7"
    }
}
function checkTemp(element,temperature){
    if(temperature<15){
        element.style.color="#9FC4E1"
    }
    else if(temperature>=15 && temperature<25){
        element.style.color="#B5EAD7"
    }
    else if(temperature>=25 && temperature<35){
        element.style.color="#FDFD96"
    }
    else if(temperature>=35){
        element.style.color="tomato"
    }
}

document.addEventListener('keydown', (event) => {
    let key = event.key;
    if(key == "Enter" && searchField== document.activeElement){
        search()
    }
  })

genUrl('seattle')