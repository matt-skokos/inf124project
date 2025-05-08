import React, { useState } from "react";
import ContentCard from "./Custom/ContentCard";
import Button from "./Custom/Button";
import { ConditionOverview } from "./Home";
import './Forecast.css';

const mockForecast = {
    best_day: ` All three days offer similar conditions with consistent SSW swells and fair surf quality.
                Given the steady wave height and light onshore winds, any of these days would be suitable
                for surfing at ____. However, if you're looking for slightly better conditions, 
                Saturday morning may offer the cleanest waves before the onshore winds pick up later in the day.`,
    forecast_3_day: [
        {
            date: "Saturday, April 12th",
            overview: `Surfers can expect moderate wave activity with favorable wind and tide conditions in the afternoon. 
                        However, the water temperature is quite cool, so appropriate wetsuits are recommended.`,
            swell_direction: "SSW",
            swell: "2-3 ft",
            swell_details: "Approximately 3 feet with a primary south-southwest (SSW) swell of 4.5 feet at 18-second intervals",
            wind_direction: "SSW",
            wind: "4 mph",
            wind_details: "Light and variable winds, around 4 mph from the southwest.",
            tide: "Low",
            tide_details: "Low tide at 3:26 PM: 0.66 feet. High tide at 9:40 PM: 5.16 feet",
        }, 
        {
            date: "Sunday, April 13th",
            overview: `Surfers can expect moderate wave activity with favorable wind and tide conditions in the afternoon. 
                        However, the water temperature is quite cool, so appropriate wetsuits are recommended.`,
            swell_direction: "SSE",
            swell: "3-4 ft",
            swell_details: "Approximately 3 feet with a primary south-southwest (SSW) swell of 4.5 feet at 18-second intervals",
            wind_direction: "SSW",
            wind: "8 mph",
            wind_details: "Light and variable winds, around 4 mph from the southwest.",
            tide: "Low",
            tide_details: "Low tide at 3:26 PM: 0.66 feet. High tide at 9:40 PM: 5.16 feet"
        }, 
        {
            date: "Monday, April 14th",
            overview: `Surfers can expect moderate wave activity with favorable wind and tide conditions in the afternoon. 
                        However, the water temperature is quite cool, so appropriate wetsuits are recommended.`,
            swell_direction: "SSW",
            swell: "1-3 ft",
            swell_details: "Approximately 3 feet with a primary south-southwest (SSW) swell of 4.5 feet at 18-second intervals",
            wind_direction: "SSW",
            wind: "5 mph",
            wind_details: "Light and variable winds, around 4 mph from the southwest.",
            tide: "High",
            tide_details: "Low tide at 3:26 PM: 0.66 feet. High tide at 9:40 PM: 5.16 feet"
        }
    ]
}

function ForecastDay({ date, swell, wind, tide }) {
    return (
        <div className="forecast-day-container">
            <h3 className="forecast-day-title">{date}</h3>
            <div className="forecast-conditions-container">
                <ConditionOverview icon="bi bi-tsunami" label="Swell">
                    <p>{swell}</p>
                </ConditionOverview>
                <ConditionOverview icon="bi bi-wind" label="Wind">
                    <p>{wind}</p>
                </ConditionOverview>
                <ConditionOverview icon="bi bi-water" label="Tide">
                    <p>{tide}</p>
                </ConditionOverview>
            </div>
        </div>
    );
}

function ForecastReport(props)
{
    const [isFavoriteSpot, setIsFavoriteSpot] = useState(false)

    return( 
        <React.Fragment>
            {/* TITLE */}
            <div className="forecast-report-container d-flex justify-content-around mb-3">
                <div className="actions-container d-flex justify-content-around mx-3">
                    
                    {isFavoriteSpot ? (
                        <i className="title-icon bi bi-suit-heart-fill mx-1"></i>
                    ):(
                        <i className="title-icon bi bi-suit-heart mx-1"></i>
                    )}
                    <i className="title-icon bi bi-share mx-1"></i>
                </div>
                <h1 className="forecast-title">{props.location}</h1>
            </div>

            {/* Best Day */}
            <div className="forecast-report-container">
                <h2 className="section-title mb-0">Best Day</h2>
                <ContentCard className="mb-4">
                    <p className="small mb-0">
                        {mockForecast.best_day}
                    </p>
                </ContentCard>
            </div>

            {/* 3 Day Forecast */}
            <div className="forecast-report-container">
                <h2 className="section-title mb-0">3 Day Forecast</h2>
                <ContentCard className="">
                    {mockForecast.forecast_3_day.map((forecast)=>(
                    <ForecastDay key={forecast.date}
                        date=   {forecast.date}
                        swell=  {forecast.swell}
                        wind=   {forecast.wind}
                        tide=   {forecast.tide}
                    />
                    ))}
                </ContentCard>
            </div>
        </React.Fragment>
    );
}

function Forecast(){
    const [location, setLocation] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="forecast-container p-3">
            {!submitted ? (
                <React.Fragment>
                    {/* ----FORM---- */}
                    <ContentCard className="forecast-card">
                        <form className="forecast-form px-2" onSubmit={handleSubmit}>
                            <div className="mb-3">
                                {/* LOCATION */}
                                <input
                                    type="text"
                                    className="form-control forecast-input"
                                    id="location"
                                    placeholder="Select location"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    required
                                />
                            </div>
                            {/* SUBMIT */}
                            <Button type="submit" className="get-report-button">
                                Get Report
                            </Button>
                        </form>
                    </ContentCard>
                </React.Fragment>
            ) : (
                <ForecastReport
                    location = {location}
                />
            )}
        </div>
    );
}

export default Forecast;