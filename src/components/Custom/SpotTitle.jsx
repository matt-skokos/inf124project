import React, { useState } from "react";
import "./SpotTitle.css";
import SocialShareButton from "./SocialShareButton.jsx";




function SpotTitle({title}) {
  const [isFavoriteSpot, setIsFavoriteSpot] = useState(false);

  // Handle heart button click
  const handleHeartClick = () => {
    setIsFavoriteSpot(!isFavoriteSpot);
  };

  return (
    <React.Fragment>
      <div className="spot-title-container d-flex align-items-center mb-3">
        {/* ICONS */}
        <div
          className="actions-container d-flex align-items-center"
          style={{ gap: "1rem" }}
        >

            {/* Favorite Icon */}
            <div className="title-icon" onClick={handleHeartClick}>
              {isFavoriteSpot ? (
                <i className="bi bi-heart-fill"></i>
              ) : (
                <i className="bi bi-heart"></i>
              )}
            </div>


            <SocialShareButton color="#23718f" size={40} />

          {/* TITLE */}
          <h1 className="spot-title mb-0 ms-2">{title}</h1>
        </div>
      </div>
    </React.Fragment>
  );
}

export default SpotTitle;
