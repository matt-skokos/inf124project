// src/components/Home.jsx
import React, { useState } from "react";
import { useCurrentDate } from "../hooks/useCurrentDate";
import { useUserLocation } from "../hooks/useUserLocation";
import PageContainer from "./Custom/PageContainer";
import ContentCard from "./Custom/ContentCard";
import './Home.css';

// —————————————————————————————
// Named exports so other modules can import them
// —————————————————————————————

const mockCondition = [ 
  { 
    date: "April 11, 2025",
    overview: "Surfers can expect moderate wave activity with favorable wind and tide conditions in the afternoon. However, the water temperature is quite cool, so appropriate wetsuits are recommended.",
    swell_direction: "SSW",
    swell: "2-3 ft",
    swell_details: "Approximately 3 feet with a primary south-southwest (SSW) swell of 4.5 feet at 18-second intervals",
    wind_direction: "SSW",
    wind: "4 mph",
    wind_details: "Light and variable winds, around 4 mph from the southwest.",
    tide: "Low",
    tide_details: "Low tide at 3:26 PM: 0.66 feet. High tide at 9:40 PM: 5.16 feet",
  }
]

export function ConditionOverview({ children, icon, label }) {
  return (
    <div className="condition-item text-center">
      <i className={`condition-icon ${icon}`}></i>
      <h3 className="condition-label card-subtitle mb-1"><strong>{label}</strong></h3>
      <div className="condition-overview">{children}</div>
    </div>
  );
}

export function ConditionDetails({ children, label, identifier }) {
  return (
    <li>
      <strong className="condition-label">{label}</strong>
      <div className="condition-details px-3" id={identifier}>
        {children}
      </div>
    </li>
  );
}

export function ConditionCard(props) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <ContentCard className={`condition-card ${isExpanded ? "expanded" : ""}`} title="Conditions">
      {isExpanded ? (
        <div className="condition-details">
          <p>{props.overview}</p>
          <ul className="list-unstyled">
            <ConditionDetails label="Swell" identifier="swell-details">
              <p>{props.swell_details}</p>
            </ConditionDetails>
            <ConditionDetails label="Wind" identifier="wind-details">
              <p>{props.wind_details}</p>
            </ConditionDetails>
            <ConditionDetails label="Tides" identifier="tides-details">
              <p>{props.tide_details}</p>
            </ConditionDetails>
          </ul>
        </div>
      ) : (
        <div className="condition-summary d-flex justify-content-around w-100">
          <ConditionOverview icon="bi bi-tsunami" label="Swell">
            <p>
              {props.swell_direction}
              <br />
              {props.swell}
            </p>
          </ConditionOverview>
          <ConditionOverview icon="bi bi-wind" label="Wind">
            <p>
              {props.wind_direction}
              <br />
              {props.wind}
            </p>
          </ConditionOverview>
          <ConditionOverview icon="bi bi-water" label="Tide">
            <p>{props.tide}</p>
          </ConditionOverview>
        </div>
      )}

      <div
        className="expand-icon"
        onClick={() => setIsExpanded((e) => !e)}
        aria-label={isExpanded ? "Collapse details" : "Expand details"}
      >
        {isExpanded ? (
          <i className="bi bi-arrows-angle-contract"></i>
        ) : (
          <i className="bi bi-arrows-angle-expand"></i>
        )}
      </div>
    </ContentCard>
  );
}

export function DateLocationCard({date, location}) {
  return (
    <ContentCard className="date-location-card" >
      <h2 className="m-0" id="current-date">{date}</h2>
      <p  className="m-0" id="current-time">{location}</p>
    </ContentCard>
  );
}

function Home() {
  const today = useCurrentDate();
  const {locationName, loading, error} = useUserLocation();

  return (
    <PageContainer className="home-container" title="Home" hideTitle={true}>
      <div className="row gx-">

        {/* ----DATE TIME---- */}
        <section className="date-location-section col-12 col-md-5 mb-4 px-md-0">
          <br className="d-none d-md-flex"/>
          <br className="d-none d-md-flex"/>
          <DateLocationCard
            date={today}
            location={loading ? "Detecting Location..." : (error ? error: locationName) }
          />
        </section>

        {/* ----CONDITIONS---- */}
        <section className="condition-section col-12 col-md-7 mb-4">
          {mockCondition.map((cond) => (
          <ConditionCard key={cond.date}
            overview        ={cond.overview}
            swell_direction ={cond.swell_direction}
            swell           ={cond.swell}
            swell_details   ={cond.swell_details}
            wind_direction  ={cond.wind_direction}
            wind            ={cond.wind}
            wind_details    ={cond.wind_details}
            tide            ={cond.tide}
            tide_details    ={cond.tide_details}
          />
          ))}
        </section>
      </div>
    </PageContainer>
  );
}

export default Home;
