import React, { useEffect, useState } from "react";
import "./Explore.css";
import HeartSpot from "./Custom/HeartButton.jsx";
import ContentCard from "./Custom/ContentCard.jsx";
import PageContainer from "./Custom/PageContainer.jsx";
import SocialShareButton from "./Custom/SocialShareButton.jsx";

const spots = [
  {
    imgURL: "https://source.unsplash.com/random/150x150?surf",
    title: "Sunset Cliffs",
    description:
      "A scenic coastal location with stunning sunset views and rugged cliffs. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam nec risus quam. Sed id nunc nec lorem malesuada luctus. Aenean bibendum nulla sed finibus egestas.",
    skillLevel: "Beginner",
  },
  {
    imgURL: `https://source.unsplash.com/150x150/?surf&sig=${Math.random()}`,
    title: "Black's Beach",
    description:
      "A peaceful hiking trail leads down to a natural reserve sand break. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam nec risus quam. Sed id nunc nec lorem malesuada luctus. Aenean bibendum nulla sed finibus egestas.",
    skillLevel: "Intermediate",
  },
  {
    imgURL: "https://source.unsplash.com/150x150/?beach,cliff,coast",
    title: "Tourmaline Street",
    description:
      "An easy access beach break and point break with parking and showers. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam nec risus quam. Sed id nunc nec lorem malesuada luctus. Aenean bibendum nulla sed finibus egestas.",
    skillLevel: "Beginner",
  },
];

function ConditionOverview({ children, icon, label }) {
  return (
    <div className="condition-item text-center">
      <i className={`condition-icon ${icon}`}></i>
      <strong className="condition-label card-subtitle mb-1">{label}</strong>
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
        <div className="condition-summary d-flex justify-content-around w-100">
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

const Explore = () => {
  const [selectedSpot, setSelectedSpot] = useState(null); // State for selected spot
  const [spotList, setSpotList] = useState(spots); // State for spot list

  // useEffect to update images with random URLs
  useEffect(() => {
    const randomBeachImages = [
      `https://picsum.photos/seed/${Math.floor(Math.random() * 1000)}/150`,
      `https://picsum.photos/seed/${Math.floor(Math.random() * 1000)}/150`,
      `https://picsum.photos/seed/${Math.floor(Math.random() * 1000)}/150`,
    ];

    const updatedSpotList = spots.map((spot, i) => ({
      ...spot,
      imgURL: randomBeachImages[i],
    }));

    setSpotList(updatedSpotList);
  }, []);

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
      <div className="explore-page explore-list-container">
        <ul className="spotItems">
          {spotList.map((spot) => (
            <li
              className="content-card"
              key={spot.title}
              onClick={() => setSelectedSpot(spot)}
            >
              <Spot {...spot} onClick={() => setSelectedSpot(spot)} />
            </li>
          ))}
        </ul>
      </div>
    </PageContainer>
  );
};

export default Explore;

const Spot = ({ imgURL, title, description, skillLevel, onClick }) => (
  <div className="spot-card" onClick={onClick}>
    <div className="spot-card-inner">
      <div className="imageWrapper">
        <img src={imgURL} alt={title} className="spotImage" />
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
              <HeartSpot color="#23718f" size={32} className="heart-button" />
              <SocialShareButton color="#23718f" size={40} />
              <h1 className="detail-name">{spot.title}</h1>
            </div>
            <div style={{ display: "flex", gap: "1rem", margin: "1rem 0" }}>
              {[...Array(3)].map((_, index) => (
                <img
                  key={index}
                  src={spot.imgURL}
                  alt={spot.title}
                  style={{
                    width: 200,
                    height: 200,
                    objectFit: "cover",
                    padding: ".5rem",
                  }}
                />
              ))}
            </div>
            {/* Date between images and details */}
            <div className="spot-date-row">{today}</div>
            <div style={{ width: "100%" }}>
              <ConditionCard
                title="Current Conditions"
                className=""
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
            </div>
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

            {/* Sources Card */}
            <div style={{ width: "100%", marginTop: "1.5rem" }}>
              <ContentCard className="sources-card" title="Sources">
                <ul className="list-unstyled text-center mb-0">
                  <li className="mb-2">
                    <a href="./" className="source-link">
                      Visit {spot.title}
                    </a>
                  </li>
                  <li className="mb-2">
                    <a href="./" className="source-link">
                      {spot.title} Community
                    </a>
                  </li>
                  <li>
                    <a href="./" className="source-link">
                      Swell Magnet
                    </a>
                  </li>
                </ul>
              </ContentCard>
            </div>

            {/* Action Buttons */}
            <div className="spot-actions d-flex justify-content-between w-100 mt-4 mb-3">
              <a href="./" className="btn action-button directions-button">
                <i className="bi bi-map me-2"></i>
                Directions
              </a>
              <a
                href="/forecast-forum"
                className="btn action-button forecast-button"
              >
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
