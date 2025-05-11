import React, { useState } from "react";
import "./SpotTitle.css";
import HeartSpot from "./HeartButton.jsx";
import SocialShareButton from "./SocialShareButton.jsx";

function SpotTitle(props) {
  const [isFavoriteSpot, setIsFavoriteSpot] = useState(false);

  // Handle heart button click
  const handleHeartClick = () => {
    setIsFavoriteSpot(!isFavoriteSpot);
  };

  return (
    <React.Fragment>
      {/* TITLE */}
      <div className="spot-title-container d-flex align-items-center mb-3">
        {/* ICONS */}
        <div
          className="actions-container d-flex align-items-center"
          style={{ gap: "1rem" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <HeartSpot
              color="#23718f"
              size={32}
              filled={isFavoriteSpot}
              onClick={handleHeartClick}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SocialShareButton color="#23718f" size={40} />
          </div>
          {/* TITLE */}
          <h1 className="spot-title mb-0 ms-2">{props.title}</h1>
        </div>
      </div>
    </React.Fragment>
  );
}

export default SpotTitle;
