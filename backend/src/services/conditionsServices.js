const fetch =  require("node-fetch");

const NWS_URL = "https://api.weather.gov"


const  NWSWeatherConditions= async (lat, lng) => {
            // Fetch gridpoint metadata for the location
            const pointRes = await fetch(`${NWS_URL}/points/${lat},${lng}`);
            if(!pointRes.ok){
                throw new Error(`NWS points fetch error: ${pointRes.status}`); 
            }
    
            const pointData = await pointRes.json(); 
            const { gridId, gridX, gridY } = pointData.properties
    
            // Fetch the nearest forecast for the most recent period from NWS (api.weather)
            const forecastRes = await fetch(
                `${NWS_URL}/gridpoints/${gridId}/${gridX},${gridY}/forecast`
            )
            if(!forecastRes.ok){
                throw new Error(`NWS forecast fetch error: ${forecastRes.status}`)
            }
    
            const forecastData = await forecastRes.json();
            const forecastPeriods = forecastData.properties.periods;
            const currentConditions = forecastPeriods[0]
    
            // Extract surf-related data
            const conditionDetails = currentConditions.detailedForecast;
            const windDirection = currentConditions.windDirection;
            const wind = currentConditions.windSpeed;
            console.log(`Local Conditions: ${conditionDetails}\nWind:${wind} - ${windDirection}`)

            return { conditionDetails, windDirection, wind }
}

module.exports = { NWSWeatherConditions }