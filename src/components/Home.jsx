// src/components/Home.jsx
import React, { useState } from "react";
import ContentCard from "./Custom/ContentCard";
import './Home.css';

// —————————————————————————————
// Named exports so other modules can import them
// —————————————————————————————

export function ConditionOverview({ children, icon, label }) {
  return (
    <div className="condition-item text-center">
      <i className={`condition-icon ${icon}`}></i>
      <strong className="condition-label card-subtitle mb-1">{label}</strong>
      <div className="condition-overview">{children}</div>
    </div>
  );
}

export function ConditionDetails({ children, label, identifier }) {
  return (
    <li>
      <strong className="condition-label">{label}</strong>
      <div className="condition-description px-3" id={identifier}>
        {children}
      </div>
    </li>
  );
}

export function ConditionCard(props) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <ContentCard className={`condition-card ${isExpanded ? "expanded" : ""}`}>
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

export function DateLocationCard(props) {
  return (
    <ContentCard className="current-date-time">
      <h2 className="current-date m-0">{props.date}</h2>
      <p className="current-time m-0">{props.location}</p>
    </ContentCard>
  );
}

// —————————————————————————————
// Default export for the Home page
// —————————————————————————————

function Home() {
  return (
    <main className="container">
      <div className="row gx-4">
        <section className="date-location-section col-12 col-md-6 mb-4">
          <DateLocationCard
            date="April 11, 2025"
            location="Near Aliso Viejo, California"
          />
        </section>

        <section className="condition-section col-12 col-md-6 mb-4">
          <h3 className="section-title mb-0">Conditions</h3>
          <ConditionCard
            overview="Surfers can expect moderate wave activity with favorable wind and tide conditions in the afternoon. However, the water temperature is quite cool, so appropriate wetsuits are recommended."
            swell_direction="SSW"
            swell="2-3 ft"
            swell_details="Approximately 3 feet with a primary south-southwest (SSW) swell of 4.5 feet at 18-second intervals"
            wind_direction="SSW"
            wind="4 mph"
            wind_details="Light and variable winds, around 4 mph from the southwest."
            tide="Low"
            tide_details="Low tide at 3:26 PM: 0.66 feet. High tide at 9:40 PM: 5.16 feet"
          />
        </section>
      </div>
    </main>
  );
}

export default Home;
