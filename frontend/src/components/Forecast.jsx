import React, { useState } from "react";
import API from "../api"; // configured Axios/fetch wrapper
import PageContainer from "./Custom/PageContainer";
import ContentCard from "./Custom/ContentCard";
import SpotTitle from "./Custom/SpotTitle";
import Button from "./Custom/Button";
import { ConditionOverview } from "./Home";
import './Forecast.css';
import { useSurfConditions } from "../hooks/useSurfConditions";
import { useCurrentDate } from "../hooks/useCurrentDate";

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

function ForecastReport({ location, lat, lng })
{
    console.log(lat,lng, location)
    const today = useCurrentDate();
    const {
        conditions : waveCond,
        loading: waveLoading,
        error: waveError,
    } = useSurfConditions(lat, lng, "wave");
    const {
        conditions : windCond,
        loading: windLoading,
        error: windError,
    } = useSurfConditions(lat, lng, "wind");
    const {
        conditions : tideCond,
        loading: tideLoading,
        error: tideError,
    } = useSurfConditions(lat, lng, "tide");

    // If any of the three is still loading, show a loading state
    if (waveLoading || windLoading || tideLoading) {
        return(<ContentCard className="mb-4">
            <p>Loading current conditions for {location}…</p>
        </ContentCard>)
    }

    // If any of the three has an error, show an error message
    if (waveError || windError || tideError) {
        return (
        <ContentCard className="mb-4">
            <p className="text-danger">
                {waveError && `Wave data error: ${waveError}`}
                {windError && `Wind data error: ${windError}`}
                {tideError && `Tide data error: ${tideError}`}
            </p>
        </ContentCard>
        );
    }

    return( 
        <React.Fragment>
            <SpotTitle
                title={location}
            />

            {/* Best Day */}
            <ContentCard className="mb-4" title="Best Day">
                <p className="small mb-0">
                    {mockForecast.best_day}
                </p>
            </ContentCard>

            {/* 3 Day Forecast */}
            <ContentCard title="3 Day Forecast">
                <ForecastDay key={today}
                    date=   {today}
                    swell=  {waveCond.waveHeight}
                    wind=   {windCond.wind}
                    tide=   {tideCond.tide}
                />
            </ContentCard>
        </React.Fragment>
    );
}

function ForecastForm({ location, setLocation, onSearch, errorMessage}){
    return(
        <ContentCard className="forecast-form-card">
            {/* ----FORM---- */}
            <form className="forecast-form px-2" onSubmit={onSearch}>
                
                {/* LOCATION */}
                <div className="mb-3">
                    <label className="visually-hidden" htmlFor="location">Location</label>
                    <input
                        type="text"
                        className="form-control forecast-input"
                        id="location"
                        placeholder="Select location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />

                    {errorMessage && (
                        <div className="text-danger mt-2">
                            {errorMessage}
                        </div>
                    )}
                </div>

                {/* SUBMIT */}
                <Button type="submit" className="get-report-button">
                    Get Report
                </Button>
            </form>
        </ContentCard>
    );
}

function Forecast(){
    const [location, setLocation] = useState("");
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSearch = async (e) => {
        e.preventDefault(); 
        setErrorMessage(""); 

        try{
            const res = await fetch(`${process.env.REACT_APP_API_URL}/location/coords?address=${encodeURIComponent(location)}`);
            if(!res.ok){
                const errJson = await res.json().catch(() => ({})); 
                throw new Error(errJson.error || "Unable to resolve coordinates");
            }

            const data = await res.json(); 
            if(!data.lat || !data.lng){
                throw new Error("No coordinates found");
            }
            setLat(data.lat); 
            setLng(data.lng);
            setSubmitted(true);
        }catch(err){
            setErrorMessage(`Sorry, we couldn't find "${location}". Please try another beach or address.`); 
            console.error("Location lookup failed:", err);
        }
    }

    return (
        <PageContainer title="Forecast" hideTitle={!submitted ? false:true}>
            {!submitted ? (
                <ForecastForm 
                    location={location} 
                    setLocation={setLocation} 
                    onSearch={handleSearch}
                    errorMessage={errorMessage}
                />
            ) : (
                <ForecastReport location = {location} lat={lat} lng={lng}/>
            )}
        </PageContainer>
    );
}

export default Forecast;