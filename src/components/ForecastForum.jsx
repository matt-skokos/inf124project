import React, { useState } from "react";
import ContentCard from "./Custom/ContentCard";
import Button from "./Custom/Button";

function ForecastForum(){

    const [location, setLocation] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login logic here, e.g., API call to authenticate user
        console.log("Location:", location);
    };

    return(
        <div className="container">
            <h3 className="section-title mb-0">Forecast</h3>
        
            <ContentCard>
                <form className="login-form px-4" onSubmit={handleSubmit}>
                    {/* EMAIL */}
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