import React, { useState } from "react";
import SocialModal from "./SocialModal";
import "./SpotTitle.css";

function SpotTitle({title}) {
  const [isFavoriteSpot, setIsFavoriteSpot] = useState(false);
  const [isSocialModalDisplayed, setShowSocialModal] = useState(false);
  
  return (
    <React.Fragment>
      <div className="spot-title-container d-flex align-items-center mb-3">
        {/* ICONS */}
        <div
          className="actions-container d-flex align-items-center"
        >
          {/* Favorite Icon */}
          <div className="title-icon" onClick={() => setIsFavoriteSpot(!isFavoriteSpot)}>
            {isFavoriteSpot ? (
              <i className="bi bi-heart-fill"></i>
            ) : (
              <i className="bi bi-heart"></i>
            )}
          </div>

          {/* Social Icon */} 
          <div className="title-icon" onClick={() => setShowSocialModal(true)}>
            <i className="bi bi-share-fill"></i>
          </div>
          <SocialModal
            isOpen={isSocialModalDisplayed}
            onClose={()=> setShowSocialModal(false)}
          />
        </div>
        {/* TITLE */}
        <h1 className="spot-title mb-0 ms-2">{title}</h1>
      </div>

      
    </React.Fragment>
  );
}

export default SpotTitle;
