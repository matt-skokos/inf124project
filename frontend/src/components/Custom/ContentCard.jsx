import React from "react";
import './ContentCard.css';

function ContentCard({children, className, ...props}){
    return(
        <div className="card-container">

            {/* ----TITLE---- */}
            {props.title && (
            <h2 className="section-title mb-2">{props.title}</h2>
            )}

            {/* ----BODY---- */}
            <div className={className + " content-card card"}>
                <div className="card-body justify-content-around">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default ContentCard