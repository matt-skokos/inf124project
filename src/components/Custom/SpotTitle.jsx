import React, { useState } from "react";
import './SpotTitle.css'
function SpotTitle (props)
{
    const [isFavoriteSpot, setIsFavoriteSpot] = useState(false)

    return(
        <React.Fragment>
            {/* TITLE */}
            <div className="spot-title-container d-flex justify-content-around mb-3">
                <div className="actions-container d-flex justify-content-around mx-3">
                    {isFavoriteSpot ? (
                        <i className="title-icon bi bi-suit-heart-fill mx-1"></i>
                    ):(
                        <i className="title-icon bi bi-suit-heart mx-1"></i>
                    )}
                    <i className="title-icon bi bi-share mx-1"></i>
                </div>
                <h1 className="spot-title">{props.title}</h1>
            </div>
        </React.Fragment>
    );
}

export default SpotTitle