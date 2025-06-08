import React, { useState, useEffect } from "react";
import API from "../../api";
import SocialModal from "./SocialModal";
import "./SpotTitle.css";

function SpotTitle({ title, lat, lng }) {
  const [isFavoriteSpot, setIsFavoriteSpot] = useState(false);
  const [isSocialModalDisplayed, setShowSocialModal] = useState(false);
  
  useEffect(() => {
    async function checkFavorites(){
      try{
        const res = await API.get(`/favorites/location?lat=${lat}&lng=${lng}`)
        setIsFavoriteSpot(res.data.location != null);
      }catch(err){
        console.error("Error checking favorite:", err);
      }
    }
    checkFavorites(); 
  }, [lat, lng]);

  const toggleFavorite = async () => {
    const next = !isFavoriteSpot;
    setIsFavoriteSpot(next); 
    if (next){
      try{
        await API.post("/favorites", {name: title, lat, lng });
      } catch (err){
        console.error("Error adding favorite", err); 
      }
    } else{
      try{
        await API.delete(`/favorites?lat=${lat}&lng=${lng}`) 
      } catch(err){
        console.error("Error removing favorite:", err);
      }
    }
  }

  return (
    <React.Fragment>
      <div className="spot-title-container d-flex align-items-center mb-3">
        {/* ICONS */}
        <div
          className="actions-container d-flex align-items-center"
        >
          {/* Favorite Icon */}
          <div className="title-icon" onClick={() => toggleFavorite()}>
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
