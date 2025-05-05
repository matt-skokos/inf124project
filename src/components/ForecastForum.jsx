import React, { useState } from "react";
import ContentCard from "./Custom/ContentCard";
import Button from "./Custom/Button";
import './ForecastForum.css';

function ForecastForum(){
    const [location, setLocation] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="forecast-forum-container p-1">
            <h3 className="section-title mb-0">Forecast</h3>

            {!submitted ? (
                <ContentCard className="forecast-card">
                    <form className="forecast-form px-2" onSubmit={handleSubmit}>
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
                        <Button type="submit" className="get-report-button">
                            Get Report
                        </Button>
                    </form>
                </ContentCard>
            ) : (
                <>
                    <h4 className="forecast-location mb-3">{location}</h4>

                    {/* Best Day */}
                    <h5 className="forecast-subheader">Best Day</h5>
                    <ContentCard className="forecast-bestday-card">
                        <p className="small mb-0">
                            All three days offer similar conditions with consistent SSW swells and fair surf quality.
                            Given the steady wave height and light onshore winds, any of these days would be suitable
                            for surfing at {location}. However, if you're looking for slightly better conditions, 
                            Saturday morning may offer the cleanest waves before the onshore winds pick up later in the day.
                        </p>
                    </ContentCard>

                    {/* 3 Day Forecast */}
                    <h5 className="forecast-subheader">3 Day Forecast</h5>
                    <ContentCard className="forecast-card">
                        <div className="forecast-day">
                            <p className="day-label">Saturday, April 12th</p>
                            <div className="day-conditions">
                                <div className="condition-item"><i className="bi bi-tsunami"></i> SSW, 2–3 ft</div>
                                <div className="condition-item"><i className="bi bi-wind"></i> SSW, 4 mph</div>
                                <div className="condition-item"><i className="bi bi-water"></i> Low</div>
                            </div>
                        </div>

                        <div className="forecast-day">
                            <p className="day-label">Sunday, April 13th</p>
                            <div className="day-conditions">
                                <div className="condition-item"><i className="bi bi-tsunami"></i> SSW, 2–3 ft</div>
                                <div className="condition-item"><i className="bi bi-wind"></i> Light/Variable</div>
                                <div className="condition-item"><i className="bi bi-water"></i> Low</div>
                            </div>
                        </div>

                        <div className="forecast-day">
                            <p className="day-label">Monday, April 14th</p>
                            <div className="day-conditions">
                                <div className="condition-item"><i className="bi bi-tsunami"></i> SSW, 2–3 ft</div>
                                <div className="condition-item"><i className="bi bi-wind"></i> S, 5 mph</div>
                                <div className="condition-item"><i className="bi bi-water"></i> Rising</div>
                            </div>
                        </div>
                    </ContentCard>
                </>
            )}
        </div>
    );
}

export default ForecastForum;
