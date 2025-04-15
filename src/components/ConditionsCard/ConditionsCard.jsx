import React from "react";
import './ConditionsCard.css'

function ConditionsCard({ swell, wind, tide}){
    return(
        <div className="conditions-card">
            {/* swell */}
            <div className="condition-item">
                <div className="condition-icon">
                    {/* TODO: Replace with swell icon from figma */}
                    <p>swell icon</p>
                </div>
                <div className="condition-label">Swell</div>
                <div className="condition-value">{swell} ft</div>
            </div>

            {/* wind */}
            <div className="condition-item">
                <div className="condition-icon">
                    {/* TODO: Replace with wind icon from figma */}
                    <p>wind icon</p>
                </div>
                <div className="condition-label">Wind</div>
                <div className="condition-value">{wind} mph</div>
            </div>

            {/* tide */}
            <div className="condition-item">
                <div className="condition-icon">
                    {/* TODO: Replace with tide icon from figma */}
                    <p>tide icon</p>
                </div>
                <div className="condition-label">Tide</div>
                <div className="condition-value">{tide}</div>
            </div>
        </div>
    );
}

export default ConditionsCard