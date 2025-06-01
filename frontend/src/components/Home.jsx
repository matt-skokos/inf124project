// src/components/Home.jsx
import React, { useState } from "react";
import { useCurrentDate } from "../hooks/useCurrentDate";
import { useUserLocation } from "../hooks/useUserLocation";
import { useCurrentConditions } from "../hooks/useCurrentConditions";
import PageContainer from "./Custom/PageContainer";
import ContentCard from "./Custom/ContentCard";
import './Home.css';

// —————————————————————————————
// Named exports so other modules can import them
// —————————————————————————————

export function ConditionOverview({ children, icon, label }) {
  return (
    <div className="condition-item text-center">
      <i className={`condition-icon ${icon}`}></i>
      <h3 className="condition-label card-subtitle mb-1"><strong>{label}</strong></h3>
      <div className="condition-overview">{children}</div>
    </div>
  );
}

export function ConditionCard({ overview, swell_direction, swell, wind_direction, wind, tide }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <ContentCard className={`condition-card ${isExpanded ? "expanded" : ""}`} title="Conditions">
      {isExpanded ? (
        // ----EXPANDED CARD----
        <div className="condition-details">
          <p>{overview}</p>
         </div>
      ) : (
        // ----COLLAPSED CARD----
        <div className="condition-summary d-flex justify-content-around w-100">
          <ConditionOverview icon="bi bi-tsunami" label="Swell">
            <p>
              {swell_direction}
              <br />
              {swell} ft
            </p>
          </ConditionOverview>
          <ConditionOverview icon="bi bi-wind" label="Wind">
            <p>
              {wind_direction}
              <br />
              {wind}
            </p>
          </ConditionOverview>
          <ConditionOverview icon="bi bi-water" label="Tide">
            <p>{tide}</p>
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
  const {lat, lng, locationName, loading: loadingLoc, error: errorLoc} = useUserLocation();
  const {conditions, loading: loadingCond, error: errorCond } = useCurrentConditions(lat, lng);

  return (
    <PageContainer className="home-container" title="Home" hideTitle={true}>
      <div className="row gx-">

        {/* ----DATE TIME---- */}
        <section className="date-location-section col-12 col-md-5 mb-4 px-md-0">
          <br className="d-none d-md-flex"/>
          <br className="d-none d-md-flex"/>
          <DateLocationCard
            date={today}
            location={loadingLoc ? "Detecting Location..." : (errorLoc ? errorLoc: locationName) }
          />
        </section>

        {/* ----CONDITIONS---- */}
        <section className="condition-section col-12 col-md-7 mb-4">
          
          {loadingCond && (
            <ContentCard className="condition-card" title="Conditions">
              <p>Loading conditions…</p>
            </ContentCard>
          )}

          {(errorCond && !loadingCond) && (
            <ContentCard className="condition-card">
              <p>Error loading conditions: {errorCond}</p>
            </ContentCard>
          )}

          {(!loadingCond && !errorCond && conditions) && (
              <ConditionCard key={today}
                overview        ={conditions.aiOverview}
                swell_direction ={conditions.waveDirection}
                swell           ={conditions.waveHeight}
                wind_direction  ={conditions.windDirection}
                wind            ={conditions.wind}
                tide            ={conditions.tide}
              />
          )}

        </section>
      </div>
    </PageContainer>
  );
}

export default Home;
