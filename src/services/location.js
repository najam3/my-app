const getLocation = () => {
  return new Promise((resolve, reject) => {
    let locationInfo = {};
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        const key = "c7fa55a8fc7e4436a6473c38834d4d58";
        
        const api = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${long}&key=${key}`;
        fetch(api)
          .then(response => response.json())
          .then(data => {
            
            let city = data.results[0].components.city;
            let country = data.results[0].components.country;
            let newLoc = { ...locationInfo, city, country };
          
            locationInfo = newLoc;
            resolve(locationInfo);
          })
          .catch(error => reject(error)); 
      });
    } else {
      reject(new Error("Geolocation is not available"));
    }
  });
};

export default getLocation; 














