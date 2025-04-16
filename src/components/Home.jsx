import React from "react";
import DateLocationCard from "./Cards/DateLocationCard";
import ConditionCard from "./Cards/ConditionCard";
import './Home.css'

function Home() {
    return(
        <main className="container" >
            <div className="row">
                <section className="date-location-section col">
                    <DateLocationCard
                        date='April 11, 2025'
                        location='Near Aliso Viejo, California'
                    />
                </section>
                
                <section className="conditions-sections col">
                    <h3>Conditions</h3>
                    <ConditionCard className=""
                        swell="2-3"
                        wind="4"
                        tide="Low"
                    />
                </section>
            </div>

        </main>
    ); 
}

export default Home