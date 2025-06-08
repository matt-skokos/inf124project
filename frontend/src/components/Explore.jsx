import React, { useEffect, useState } from "react";
import "./Explore.css";
import ContentCard from "./Custom/ContentCard.jsx";
import PageContainer from "./Custom/PageContainer.jsx";
import SpotTitle from "./Custom/SpotTitle.jsx";

function ConditionOverview({ children, icon, label }) {
  return (
    <div className="condition-item text-center">
      <i
        className={`condition-icon ${icon} mb-2`}
        style={{ fontSize: "2rem" }}
      ></i>
      <strong className="condition-label card-subtitle mb-2">{label}</strong>
      <div className="condition-overview">{children}</div>
    </div>
  );
}

function ConditionDetails({ children, label, identifier }) {
  return (
    <li>
      <strong className="condition-label">{label}</strong>
      <div className="condition-description px-3" id={identifier}>
        {children}
      </div>
    </li>
  );
}

function ConditionCard(props) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <ContentCard
      className={`condition-card ${isExpanded ? "expanded" : ""}`}
      title={props.title}
    >
      {isExpanded ? (
        <div className="condition-details">
          <p>{props.overview}</p>

          <ul className="list-unstyled">
            {/* SWELL */}
            <ConditionDetails label="Swell" identifier="swell-details">
              <p>{props.swell_details}</p>
            </ConditionDetails>

            {/* WIND */}
            <ConditionDetails label="Wind" identifier="wind-details">
              <p>{props.wind_details}</p>
            </ConditionDetails>

            {/* Tides */}
            <ConditionDetails label="Tides" identifier="tides-details">
              <p> {props.tide_details} </p>
            </ConditionDetails>
          </ul>
        </div>
      ) : (
        <div className="condition-summary d-flex justify-content-around w-100 py-3">
          {/* SWELL */}
          <ConditionOverview icon={"bi bi-tsunami"} label="Swell">
            <p>
              {props.swell_direction}
              <br />
              {props.swell}
            </p>
          </ConditionOverview>

          {/* WIND */}
          <ConditionOverview icon={"bi bi-wind"} label="Wind">
            <p>
              {props.wind_direction}
              <br />
              {props.wind}
            </p>
          </ConditionOverview>

          {/* TIDE */}
          <ConditionOverview
            icon={"bi bi-water"}
            label="Tide"
            value={props.tide}
          >
            <p>{props.tide}</p>
          </ConditionOverview>
        </div>
      )}

      {/* EXPAND BUTTON */}
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

// Update the utility function with better formatted URLs for surf sources
const generateSurfSources = (spotName, location) => {
  // Clean the spot name for searches
  const cleanSpotName = spotName.trim();

  return [
    {
      name: `${spotName} Surf Report`,
      url: `https://www.surfline.com/search/${encodeURIComponent(
        cleanSpotName
      )}`,
    },
    {
      name: `Google Search: ${spotName} Surf Conditions`,
      url: `https://www.google.com/search?q=${encodeURIComponent(
        cleanSpotName + " surf forecast"
      )}`,
    },
    {
      name: `NOAA Marine Weather`,
      url: `https://www.weather.gov/marine`,
    },
  ];
};

const Explore = () => {
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [spotList, setSpotList] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user location from localStorage on component mount and fetch spots
  useEffect(() => {
    const storedLocation = localStorage.getItem("userLocation");
    setUserLocation(storedLocation || null);

    if (storedLocation) {
      setLoading(true);

      // Make sure we're using the correct API URL
      const API_URL =
        process.env.REACT_APP_API_URL || "http://localhost:8080/api";

      console.log(
        `Using API URL: ${API_URL}, fetching spots for ${storedLocation}`
      );

      // Use fetch with mode: 'cors' to avoid CORS issues in development
      fetch(
        `${API_URL}/location/surfspots?location=${encodeURIComponent(
          storedLocation
        )}`,
        {
          method: "GET",
          mode: "cors",
          headers: {
            Accept: "application/json",
          },
        }
      )
        .then((response) => {
          if (!response.ok) {
            console.error(`Error response: ${response.status}`);
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("API response:", data);

          if (
            data &&
            data.spots &&
            Array.isArray(data.spots) &&
            data.spots.length > 0
          ) {
            const transformedSpots = data.spots.map((spot, index) => {
              // Simply pass the photoUrls array through to the component
              return {
                id: `spot-${index}`,
                title: spot.name,
                description: spot.description,
                skillLevel: spot.difficulty || "Intermediate",
                photoUrls: spot.photoUrls || [],
                // No fallback to Unsplash, let the component handle missing images
              };
            });
            setSpotList(transformedSpots);
          } else {
            setError("Unable to locate any spots in your current location.");
          }
        })
        .catch((err) => {
          console.error("Error fetching spots:", err);
          setError(`Network error: ${err.message}`);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setError("Geolocation not enabled");
      setLoading(false);
    }
  }, []);

  // The rest of your component logic
  if (selectedSpot) {
    return (
      <div className="explore-page explore-detail-container">
        <div className="back-button-container">
          <a
            href="#"
            className="btn action-button back-button"
            style={{
              width: "auto",
              display: "inline-flex",
              padding: "0.5rem 1rem",
            }}
            onClick={(e) => {
              e.preventDefault();
              setSelectedSpot(null);
            }}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Back to Spots
          </a>
        </div>
        <div className="spot-detail-wrapper">
          <SpotDetail spot={selectedSpot} />
        </div>
      </div>
    );
  }

  return (
    <PageContainer title="Explore Spots">
      <div className="location-subheading">
        {userLocation ? (
          <span>Spots near {userLocation}</span>
        ) : (
          <span>Geolocation not enabled</span>
        )}
      </div>
      <div className="explore-page explore-list-container">
        {loading ? (
          <div className="loading-container text-center my-4">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Searching for surf spots...</p>
          </div>
        ) : error ? (
          <ContentCard className="error-message">
            <p className="text-center">{error}</p>
          </ContentCard>
        ) : spotList.length > 0 ? (
          <ul className="spotItems">
            {spotList.map((spot) => (
              <li
                className="content-card"
                key={spot.id || spot.title}
                onClick={() => setSelectedSpot(spot)}
              >
                <Spot {...spot} onClick={() => setSelectedSpot(spot)} />
              </li>
            ))}
          </ul>
        ) : (
          <ContentCard className="error-message">
            <p className="text-center">No surf spots found in your area.</p>
          </ContentCard>
        )}
      </div>
    </PageContainer>
  );
};

export default Explore;

const Spot = ({ photoUrls, title, description, skillLevel, onClick }) => (
  <div className="spot-card" onClick={onClick}>
    <div className="spot-card-inner">
      <div className="imageWrapper">
        {photoUrls && photoUrls.length > 0 ? (
          <img src={photoUrls[0]} alt={title} className="spotImage" />
        ) : (
          <div className="spotImage d-flex align-items-center justify-content-center bg-light">
            <span className="text-center p-2">{title}</span>
          </div>
        )}
      </div>
      <div className="spot-card-content">
        <h2 className="title">{title}</h2>
        <p>{description}</p>
        <h3 className="skill">
          <strong>Skill Level: </strong>
          {skillLevel}
        </h3>
      </div>
    </div>
  </div>
);

const SpotDetail = ({ spot }) => {
  // Get today's date in a readable format
  const today = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Props for the spot detail
  const idealTide = spot.idealTide || "High tide";
  const crowdFactor = spot.crowdFactor || "Generally uncrowded";

  // Generate relevant surf sources for this specific spot
  const surfSources = generateSurfSources(
    spot.title,
    localStorage.getItem("userLocation") || ""
  );

  // Generate Google Maps URL for directions
  const googleMapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(
    `${spot.title} surf spot`
  )}`;

  return (
    <PageContainer>
      <div className="container ">
        <div className="spot-detail-centered">
          <div className="spot-detail">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <SpotTitle title={spot.title} />
            </div>
            <div style={{ display: "flex", gap: "1rem", margin: "1rem 0" }}>
              {/* If the spot has photoUrls, use those; otherwise show placeholder */}
              {spot.photoUrls && spot.photoUrls.length > 0
                ? // Map through available photoUrls (up to 3)
                  spot.photoUrls.slice(0, 3).map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`${spot.title} view ${index + 1}`}
                      style={{
                        width: 200,
                        height: 200,
                        objectFit: "cover",
                        padding: ".5rem",
                      }}
                    />
                  ))
                : // Fallback: show placeholders with text
                  [...Array(3)].map((_, index) => (
                    <div
                      key={index}
                      style={{
                        width: 200,
                        height: 200,
                        backgroundColor: "#f0f0f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: ".5rem",
                      }}
                    >
                      <span className="text-center">{spot.title}</span>
                    </div>
                  ))}
            </div>
            {/* Date between images and details */}
            <div className="spot-date-row">{today}</div>
            {/* <div style={{ width: "100%" }}>
              <ConditionCard
                title="Current Conditions"
                className="d-flex flex-row justify-content-between w-100"
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
            </div> */}

            <div style={{ width: "100%", marginTop: "1rem" }}>
              <ContentCard
                className="spot-attributes-card"
                title="Spot Overview"
              >
                <div
                  className="d-flex flex-row justify-content-between w-100"
                  style={{ gap: "2rem" }}
                >
                  <div>
                    <strong>Skill Level</strong>
                    <div>{spot.skillLevel}</div>
                  </div>
                  <div>
                    <strong>Ideal Tide</strong>
                    <div>{idealTide}</div>
                  </div>
                  <div>
                    <strong>Crowd Factor</strong>
                    <div>{crowdFactor}</div>
                  </div>
                </div>
              </ContentCard>
            </div>

            {/* Detailed Spot Overview Card */}
            <div style={{ width: "100%", marginTop: "1.5rem" }}>
              <ContentCard
                className="spot-overview-card"
                title="Local Insights"
              >
                <p className="mb-0">
                  Sunset Cliffs in San Diego is a popular surfing destination
                  known for its beautiful coastal bluffs and reliable waves. It
                  offers a range of breaks, including reef breaks and beach
                  breaks, with a mix of left and right-hand waves. The area is
                  known for its glassy barrels when the tide is low and kelp
                  beds and sandy bottom form the perfect beach break. However,
                  it's also important to be aware of the potential dangers,
                  including rocky cliffs and exposed reefs, and to respect the
                  locals and follow surf etiquette, especially during busy
                  periods.
                </p>
              </ContentCard>
            </div>

            {/* Sources Card  */}
            <div style={{ width: "100%", marginTop: "1.5rem" }}>
              <ContentCard className="sources-card" title="Sources">
                <ul className="list-unstyled text-center mb-0">
                  {surfSources.map((source, index) => (
                    <li key={index} className="mb-2">
                      <a
                        href={source.url}
                        className="source-link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {source.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </ContentCard>
            </div>

            {/* Action Buttons - Simplified forecast link */}
            <div className="spot-actions d-flex justify-content-between w-100 mt-4 mb-3">
              <a
                href={googleMapsUrl}
                className="btn action-button directions-button"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-map me-2"></i>
                Directions
              </a>
              <a href="/forecast" className="btn action-button forecast-button">
                <i className="bi bi-cloud me-2"></i>
                Forecast
              </a>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
