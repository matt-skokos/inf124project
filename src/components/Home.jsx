import React from "react";
import ConditionsCard from "./ConditionsCard/ConditionsCard";
import './Home.css'

function Home() {
    return(
        <main>
            <section className="date-location-section">
                <h2>April 11, 2025</h2>
                <p>Near Aliso Viejo, California</p>
            </section>
            
            <section className="conditions-sections">
                <h3>Conditions</h3>
                <ConditionsCard
                    swell="2-3"
                    wind="4"
                    tide="Low"
                />
            </section>
        </main>
    ); 
}

export default Home