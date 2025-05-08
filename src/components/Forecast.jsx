import React, { useState } from "react";
import PageContainer from "./Custom/PageContainer";
import ContentCard from "./Custom/ContentCard";
import SpotTitle from "./Custom/SpotTitle";
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
    return( 
        <React.Fragment>
            <SpotTitle
                title={props.location}
            />

            {/* Best Day */}
            <ContentCard className="mb-4" title="Best Day">
                <p className="small mb-0">
                    {mockForecast.best_day}
                </p>
            </ContentCard>

            {/* 3 Day Forecast */}
            <ContentCard title="3 Day Forecast">
                {mockForecast.forecast_3_day.map((forecast)=>(
                <ForecastDay key={forecast.date}
                    date=   {forecast.date}
                    swell=  {forecast.swell}
                    wind=   {forecast.wind}
                    tide=   {forecast.tide}
                />
                ))}
            </ContentCard>
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
        <PageContainer>
                {!submitted ? (
                    <ContentCard>
                        {/* ----FORM---- */}
                        <form className="forecast-form px-2" onSubmit={handleSubmit}>
                            
                            {/* LOCATION */}
                            <div className="mb-3">
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
                ) : (
                    <ForecastReport
                        location = {location}
                    />
                )}
        </PageContainer>
    );
}

export default Forecast;