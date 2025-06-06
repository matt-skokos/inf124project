import React, { useState } from "react";
import PageContainer from "./Custom/PageContainer";
import ContentCard from "./Custom/ContentCard";
import SpotTitle from "./Custom/SpotTitle";
import Button from "./Custom/Button";
import ImageCarousel from "./Custom/ImageCarousel";
import { useDate } from "../hooks/useDate";
import { ConditionOverview } from "./Home";
import { useSurfConditions } from "../hooks/useSurfConditions";
import { useSurfPrediction } from "../hooks/useSurfPrediction";
import './Forecast.css';

function ForecastDay({ date, waveCond, windCond, tideCond }) {
    return (
        <div className="forecast-day-container">
            <h3 className="forecast-day-title">{date}</h3>
            <div className="forecast-conditions-container">
                <ConditionOverview icon="bi bi-tsunami" label="Swell">
                    <p>
                        {waveCond.waveDirection}
                        <br />
                        {waveCond.waveHeight} ft
                    </p>
                </ConditionOverview>
                <ConditionOverview icon="bi bi-wind" label="Wind">
                    <p>
                        {windCond.windDirection}
                        <br />
                        {windCond.wind}
                    </p>
                </ConditionOverview>
                <ConditionOverview icon="bi bi-water" label="Tide">
                    <p>
                        {tideCond.tide}
                        <br />
                        {tideCond.tideTime}
                    </p>
                </ConditionOverview>
            </div>
        </div>
    );
}

function ForecastReport({ location, lat, lng })
{
    const today = useDate();
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

    const {
        prediction,
        loading: predictionLoading,
        error: predictionError,
    } = useSurfPrediction(location, lat, lng, 3);

    // If any of the three is still loading, show a loading state
    if (waveLoading || windLoading || tideLoading) {
        return(<ContentCard className="mb-4">
            <div className="d-flex align-items-center">
                <strong>Loading {location} forecast...</strong>
                <div className="spinner-border ms-auto" role="status" aria-hidden="true"/>
            </div>
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

            <ImageCarousel locationName={location}/>

            {/* Current Conditions */}
            <ContentCard className="mb-2" title="Current Conditions">
                <ForecastDay key={today}
                    date=   {today}
                    waveCond=  {waveCond}
                    windCond=   {windCond}
                    tideCond=   {tideCond}
                />
            </ContentCard>

            {/* Surf Report */}
            <ContentCard className="mb-2" title="Surf Report">
                {predictionLoading && (
                    <div className="d-flex align-items-center">
                        <strong>"Loading AI surf report......</strong>
                        <div className="spinner-border ms-auto" role="status" aria-hidden="true"/>
                    </div>
                )}
                {(!predictionLoading && predictionError) && (
                    <p className="condition-overview text-danger mb-0">{`Error: ${predictionError}`}</p>
                )}

                {(!predictionLoading && !predictionError) && (
                    <p className="condition-overview mb-0">{prediction.aiReport}</p>
                )}
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