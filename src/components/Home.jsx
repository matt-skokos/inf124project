import React from "react";
import DateLocationCard from "./Cards/DateLocationCard";
import ConditionCard from "./Cards/ConditionCard";
import './Home.css'

function Home() {
    return(
        <main>
            <section className="date-location-section">
                <DateLocationCard
                    date='April 11, 2025'
                    location='Near Aliso Viejo, California'
                />
            </section>
            
            <section className="conditions-sections">
                <h3>Conditions</h3>
                <ConditionCard
                    swell="2-3"
                    wind="4"
                    tide="Low"
                />
            </section>
        </main>
    ); 
}

export default Home