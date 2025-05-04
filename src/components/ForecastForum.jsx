import React, { useState } from "react";
import ContentCard from "./Custom/ContentCard";
import Button from "./Custom/Button";
import './ForecastForum.css'

function ForecastForum(){

    const [location, setLocation] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login logic here, e.g., API call to authenticate user
        console.log("Location:", location);
    };

    return(
        <div className="forecast-forum-container p-1">
            <h3 className="section-title mb-0">Forecast</h3>
            <ContentCard className="forecast-card">
                <form className="forecast-form px-2" onSubmit={handleSubmit}>
                    {/* LOCATION */}
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control forecast-input"
                            id="location"
                            placeholder="location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            required
                        />
                    </div>
                    <Button type="submit" className="get-report-button" >Get Report</Button>
                </form>
            </ContentCard>
        </div>
    );
}

export default ForecastForum