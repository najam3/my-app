import React, { useEffect, useState } from 'react'
import getLocation from '../services/location';
import lunar from '../imgs/lunar.png';
import sky from '../imgs/sun-465936.svg';
import {  BiCurrentLocation } from 'react-icons/bi';
import './Header.css';
import './reset.css';
import { DateTime } from 'luxon';
import SwiperCore, { Navigation, Pagination } from 'swiper';
import {Swiper, SwiperSlide} from 'swiper/react';

const Header = () => {
const [intialLocation, setInitialLocation] = useState("");
const [intialLocationData, setInitialLocationData] = useState({});
const [forecastData, setForecastData] = useState([]);
const [inputVal, setInputVal] = useState("");
const [currentForecastData, setCurrentForeCastData] = useState({});

const key = 'd23791587b394cce925160456230804'
const foreCastUrl =
`http://api.weatherapi.com/v1/forecast.json?key=${key}&q=${inputVal}&days=7`;
const initialWeather = 
`http://api.weatherapi.com/v1/forecast.json?key=${key}&q=${intialLocation}&days=7`;



useEffect(() => {

  getLocation().then(response => {
   
    setInitialLocation(`${response.city} ${response.country}`);      
   }) 

  }, []) 

  const getWeather = async(url) => {
    const forecastResp = await fetch(url);
   const forecastData = await forecastResp.json();
   return forecastData;
}


  useEffect(() => {
    if (intialLocation) {
      getWeather(initialWeather).then(response => {
         const time = response.location.localtime;
         const newDate = new Date(time).toDateString();
         const newTimeTaken = new Date(time).toLocaleTimeString();
       
         const sunrise = response.forecast.forecastday[0].astro.sunrise;
         const sunset = response.forecast.forecastday[0].astro.sunset;
         const timezone = response.location.tz_id;
         const dt = DateTime.fromFormat(newTimeTaken, "h:mm:ss a");
         const formattedTime = dt.toFormat("HH : mm");
         const sunriseTime = DateTime.fromFormat(sunrise, 'hh:mm a', { zone: timezone });
         const sunsetTime = DateTime.fromFormat(sunset, 'hh:mm a', { zone: timezone });
         const newTime = DateTime.fromFormat(formattedTime, 'HH : mm', { zone: timezone });
         const hoursFromSunrise = sunriseTime.diff(newTime, 'hours').as('hours');
         const hoursFromSunset = sunsetTime.diff(newTime, 'hours').as('hours');
         
         // calculate hours and minutes separately
         let remainingHoursFromSunrise = Math.floor(Math.abs(hoursFromSunrise));
         let remainingMinutesFromSunrise = Math.floor((Math.abs(hoursFromSunrise) * 60) % 60);
         let remainingHoursFromSunset = Math.floor(Math.abs(hoursFromSunset));
         let remainingMinutesFromSunset = Math.floor((Math.abs(hoursFromSunset) * 60) % 60);
         
         // adjust for negative time differences
         if (hoursFromSunrise < 0) {
           remainingHoursFromSunrise = 24 - remainingHoursFromSunrise;
           remainingMinutesFromSunrise = 60 - remainingMinutesFromSunrise;
         }
         
         if (hoursFromSunset < 0) {
           remainingHoursFromSunset = 24 - remainingHoursFromSunset;
           remainingMinutesFromSunset = 60 - remainingMinutesFromSunset;
         }
         
            

         setInitialLocationData({
            cityName: response.location.name,
            countryName: response.location.country,
            temp: response.current.temp_c,
            windSpeed: response.current.wind_mph,
            feelsLike: response.current.feelslike_c,
            isDay: response.current.is_day,
            icon: response.current.condition.icon,
            time: newTimeTaken,
            date: newDate,
            text: response.current.condition.text,
            humidity: response.current.humidity,
            windDirection: response.current.wind_dir,
            cloud: response.current.cloud,
            uv: response.forecast.forecastday[0].day.uv,
            sunrise: `${remainingHoursFromSunrise} hours ${remainingMinutesFromSunrise} minutes`,  
            sunset: `${remainingHoursFromSunset} hours ${remainingMinutesFromSunset} minutes` 
          });

        
          const foreCast = response.forecast.forecastday.map(weekly => {
            return {
                date: weekly.date,
                maxTemp: weekly.day.maxtemp_c, 
                minTemp : weekly.day.mintemp_c,
                avgHumidity:  weekly.day.avghumidity,
                icon : weekly.day.condition.icon,
                text: weekly.day.condition.text,
                
               }
              });
              setForecastData(foreCast)
            })
    }

  }, [intialLocation]);







  function getData() {
    getWeather(foreCastUrl).then(response => {
   const foreCast = response.forecast.forecastday.map(weekly => {
         return {
             date: weekly.date,
             maxTemp: weekly.day.maxtemp_c, 
             minTemp : weekly.day.mintemp_c,
             avgHumidity:  weekly.day.avghumidity,
             icon : weekly.day.condition.icon,
             text: weekly.day.condition.text
            }
           });
           
         setForecastData(foreCast)
       const currentWeather = response.current;
       const currentTime = response.location.localtime;
           console.log(currentWeather)
       const time = new Date(currentTime).toLocaleTimeString();
       const date = new Date(currentTime).toDateString();

       
         const sunrise = response.forecast.forecastday[0].astro.sunrise;
         const sunset = response.forecast.forecastday[0].astro.sunset;
         const timezone = response.location.tz_id;
         const dt = DateTime.fromFormat(time, "h:mm:ss a");
         const formattedTime = dt.toFormat("HH : mm");
         const sunriseTime = DateTime.fromFormat(sunrise, 'hh:mm a', { zone: timezone });
         const sunsetTime = DateTime.fromFormat(sunset, 'hh:mm a', { zone: timezone });
         const newTime = DateTime.fromFormat(formattedTime, 'HH : mm', { zone: timezone });
         const hoursFromSunrise = sunriseTime.diff(newTime, 'hours').as('hours');
         const hoursFromSunset = sunsetTime.diff(newTime, 'hours').as('hours');
         
         // calculate hours and minutes separately
         let remainingHoursFromSunrise = Math.floor(Math.abs(hoursFromSunrise));
         let remainingMinutesFromSunrise = Math.floor((Math.abs(hoursFromSunrise) * 60) % 60);
         let remainingHoursFromSunset = Math.floor(Math.abs(hoursFromSunset));
         let remainingMinutesFromSunset = Math.floor((Math.abs(hoursFromSunset) * 60) % 60);
         
         // adjust for negative time differences
         if (hoursFromSunrise < 0) {
           remainingHoursFromSunrise = 24 - remainingHoursFromSunrise;
           remainingMinutesFromSunrise = 60 - remainingMinutesFromSunrise;
         }
         
         if (hoursFromSunset < 0) {
           remainingHoursFromSunset = 24 - remainingHoursFromSunset;
           remainingMinutesFromSunset = 60 - remainingMinutesFromSunset;
         }
         
          setCurrentForeCastData({
            cityName: response.location.name,
            countryName: response.location.country,
            temp: currentWeather.temp_c,
            windSpeed: currentWeather.wind_mph,
            feelsLike: currentWeather.feelslike_c,
            isDay: currentWeather.is_day,
            humidity: currentWeather.humidity,
            cloud: currentWeather.cloud,
            text: currentWeather.condition.text,
            icon: currentWeather.condition.icon,
            date: date,
            time: time,
            uv: response.forecast.forecastday[0].day.uv,
            sunrise: `${remainingHoursFromSunrise} hours ${remainingMinutesFromSunrise} minutes`,  
            sunset: `${remainingHoursFromSunset} hours ${remainingMinutesFromSunset} minutes`  
          });
       
         })
  }


function handleSubmit(e) {
    e.preventDefault();
    getData();
    setInitialLocation("");
    setInputVal('')
    console.log('first')
}

  return (
    <div className='weather-app'>
        <form onSubmit={handleSubmit} action="">
        <BiCurrentLocation style={{cursor: 'pointer'}} title='Current Location' size={30} onClick={() =>  getLocation().then(response => {
        setInitialLocation(`${response.city} ${response.country}`)})}/>
       
        <input type='text' placeholder='Enter a City' onChange={e => setInputVal(e.target.value)} value={inputVal}/>
        </form>
        <div>
        { intialLocation ?
        <div className='current-location'>
        <div className='current-data'>
          <div className='current-left'>
            <span className='current-city'>{intialLocationData.cityName}, {intialLocationData.countryName}</span>
            <span className='current-time'>{intialLocationData.time}</span>
            <span className='current-date'>{intialLocationData.date}</span>
          </div>
        
          <div className='current-center'>
          <div className='current-row-1'>
            
          <img width={80} height={80} src={intialLocationData.icon} alt="" />
          <span className='current-temp'>{intialLocationData.temp} &#8451;</span>
          <span className='current-weather'>{intialLocationData.text}</span>
          </div>
          <div className='current-row-2'>
            <div className='inner-row' style={{display: 'flex', flexDirection:'column', gap:'0.5em'}}>
          <span>Feels like</span> 
          <span className='inner-row-2'>{intialLocationData.feelsLike} &#8451;</span>
            </div>
            <div className='inner-row' style={{display: 'flex', flexDirection:'column', gap:'0.5em'}}>
          <span>Windspeed</span> 
          <span className='inner-row-2'> {intialLocationData.windSpeed} mph</span>
            </div>
            <div className='inner-row' style={{display: 'flex', flexDirection:'column', gap:'0.5em'}}>
          <span>Humidity</span> 
          <span className='inner-row-2'> {intialLocationData.humidity}</span>
            </div>
      
          
          </div>
          </div>
          <div className='current-end'>
            <span className='sunrise'>{intialLocationData.isDay ? `Sunset in ${intialLocationData.sunset === 0 ? '' : intialLocationData.sunset}` : `Sunrise in ${intialLocationData.sunrise} `}</span>
            <span style={{textAlign:'right' , color: 'red'}}>{intialLocationData.uv > 7 ? 'High UV risk' : intialLocationData.uv > 5   || intialLocationData.uv < 7 ? 'Moderate UV Risk' : 'No UV Risk'}</span>
          <img className='current-right'
          src={!intialLocationData.isDay ? lunar : sky} alt={intialLocationData.isDay ? 'Day' : 'Night'} />
          </div>
        </div>
        <ForeCast forecastData={forecastData}/>  
          
        </div> :  <div className='current-location'>
        <div className='current-data'>
          <div className='current-left'>
            <span className='current-city'>{currentForecastData.cityName}, {currentForecastData.countryName}</span>
            <span className='current-time'>{currentForecastData.time}</span>
            <span className='current-date'>{currentForecastData.date}</span>
          </div>
        
          <div className='current-center'>
          <div className='current-row-1'>
            
          <img width={80} height={80} src={currentForecastData.icon} alt="" />
          <span className='current-temp'>{currentForecastData.temp} &#8451;</span>
          <span className='current-weather'>{currentForecastData.text}</span>
          </div>
          <div className='current-row-2'>
            <div className='inner-row' style={{display: 'flex', flexDirection:'column', gap:'0.5em'}}>
          <span>Feels like</span> 
          <span className='inner-row-2'>{currentForecastData.feelsLike} &#8451;</span>
            </div>
            <div className='inner-row' style={{display: 'flex', flexDirection:'column', gap:'0.5em'}}>
          <span>Windspeed</span> 
          <span className='inner-row-2'> {currentForecastData.windSpeed} mph</span>
            </div>
            <div className='inner-row' style={{display: 'flex', flexDirection:'column', gap:'0.5em'}}>
          <span>Humidity</span> 
          <span className='inner-row-2'> {currentForecastData.humidity}</span>
            </div>
      
          
          </div>
          </div>
          <div className='current-end'>
            <span className='sunrise'>{currentForecastData.isDay ? `Sunset in ${currentForecastData.sunset === 0 ? '' : intialLocationData.sunset}` : `Sunrise in ${intialLocationData.sunrise} `}</span>
            <span style={{textAlign:'right' , color: 'red'}}>{currentForecastData.uv > 7 ? 'High UV risk' : currentForecastData.uv > 5   || intialLocationData.uv < 7 ? 'Moderate UV Risk' : 'No UV Risk'}</span>
          <img className='current-right'
          src={!currentForecastData.isDay ? lunar : sky} alt={currentForecastData.isDay ? 'Day' : 'Night'} />
          </div>
        </div>
        <ForeCast forecastData={forecastData}/>  
          
        </div>
        }

    </div>
    </div>
  )
}
const ForeCast = ({forecastData}) => {
 
  SwiperCore.use([Navigation, Pagination]);
  console.log(forecastData.length)
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
   
    return(
        <div className='forecast-data' style={{
        }}>
          <Swiper 
          direction='horizontal' 
          slidesPerView={3}
          navigation={true}
          spaceBetween={10}
          >
           {
          forecastData.map(item => (
            <SwiperSlide style={{display: 'flex', flexDirection: 'column'}}>
            <div className='day-col' style={{display: 'flex', flexDirection:'column', alignItems:'center', gap: '0.2em'}}>
            <span className='day'>{days[new Date(item.date).getDay()]}</span>
            <img src={item.icon} width={50} alt={item.text} />
            </div>
            <div className='temp-col' style={{display:'flex', gap:'1em', alignItems: 'center', justifyContent:'center'}}>
            <span className='max-temp'> {item.maxTemp} &deg;</span>
            <span className='min-temp' > {item.minTemp} &deg;</span>
             </div>
            </SwiperSlide>
             ))
           }
          
          </Swiper>
        </div>
    )
}

export default Header;

