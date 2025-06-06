// src/components/Home.jsx
import { useDate } from "../hooks/useDate";
import { useUserLocation } from "../hooks/useUserLocation";
import { useNearbyPlaces } from "../hooks/useNearbyPlaces";
import { useSurfConditions } from "../hooks/useSurfConditions";
import PageContainer from "./Custom/PageContainer";
import ContentCard from "./Custom/ContentCard";
import './Home.css';

export function ConditionOverview({ children, icon, label }) {
  return (
    <div className="condition-item text-center">
      <i className={`condition-icon ${icon}`}></i>
      <h3 className="condition-label card-subtitle mb-1"><strong>{label}</strong></h3>
      <div className="condition-overview">{children}</div>
    </div>
  );
}

export function ConditionCard({ location, conditions, loading, error }) {
  return (
    <ContentCard 
      className="condition-card expanded" 
      title={`Local Surf at ${(!loading && !error && location) ? location: "..."}`}
    >
      {(loading) && (
        <div className="d-flex align-items-center">
          <strong>Loading current conditions......</strong>
          <div className="spinner-border ms-auto" role="status" aria-hidden="true"/>
        </div>
      )}
      
      {(!loading && error) && (<p className="condition-overview">Error: {error}</p>)}

      {(!loading && !error && conditions) && (
        <div className="condition-summary w-100">
          {/* ─── First row: three ConditionOverview items ─── */}
          <h3 className="condition-label card-subtitle mb-1"><strong>Conditions</strong></h3>
          <div className="d-flex justify-content-around">
            <ConditionOverview icon="bi bi-tsunami" label="Swell">
              <p>
                {conditions.waveDirection}
                <br />
                {conditions.waveHeight} ft
              </p>
            </ConditionOverview>
            <ConditionOverview icon="bi bi-wind" label="Wind">
              <p>
                {conditions.windDirection}
                <br />
                {conditions.wind}
              </p>
            </ConditionOverview>
            <ConditionOverview icon="bi bi-water" label="Tide">
              <p>
                {conditions.tide}
                <br />
                {conditions.tideTime}
              </p>
            </ConditionOverview>
          </div>

          {/* ─── Second row: Overview, centered under the three conditions ─── */}
          <div className="condition-details">
            <h3 className="condition-label card-subtitle mb-1"><strong>Overview</strong></h3>
            <div className="condition-overview">{conditions.aiReport}</div>
          </div>

        </div>
    )}
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
  // Get the current date/time string
  const today = useDate();

  // Get the user’s lat/lng + locationName
  const { lat, lng, locationName, loading: loadingLoc, error: errorLoc } = useUserLocation();
  
  // Find nearby “beach” places based on user lat/lng
  const { places, loading: loadingPlaces, error: errorPlaces } = useNearbyPlaces(lat, lng, 1);
  
  // Derive "beachName", “beachLat” & “beachLng” only after `places[0]` confirmed present.
  let beachName = ""
  let beachLat = null; 
  let beachLng = null; 

  if(Array.isArray(places) && places.length > 0 && places[0].location){
    beachName = `${places[0].addressComponents[0].shortText}`;
    beachLat = places[0].location.latitude;
    beachLng = places[0].location.longitude;
  }

  // Call useSurfConditions with (beachLat, beachLng).  Until `beachLat` or `beachLng` is non-null
  const { conditions, loading: loadingCond, error: errorCond } = useSurfConditions(beachLat, beachLng, "overview", beachName);
  // Combine the loading/error states for global `loading` & 'error' flag .
  const loading = (loadingLoc ? true : (loadingPlaces ? true : loadingCond));
  const error = (errorLoc || errorPlaces || errorCond);

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
            <ConditionCard
              location    ={beachName}
              conditions  ={conditions}
              loading     ={loading}
              error       ={error}
            />
        </section>
      </div>
    </PageContainer>
  );
}

export default Home;
